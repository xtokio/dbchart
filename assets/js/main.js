let canvas_objects_draggable = new Map();
let canvas_objects_lines = [];
let canvas_objects_ids = [];
let canvas_consecutive = 0;
let fields_connect = [];

$(document).ready(function(){

  // New Table
  dragula([document.getElementById("db_element_table"), document.getElementById("canvas")], {
    copy: true
  }).on('drop', function (el) {
    this.remove();

    add_element_to_canvas("New table","table.svg");
    refresh_canvas();    
  });

  // New View
  dragula([document.getElementById("db_element_view"), document.getElementById("canvas")], {
    copy: true
  }).on('drop', function (el) {
    this.remove();

    add_element_to_canvas("New view","view.svg");
    refresh_canvas(); 

  });

  function add_element_to_canvas(element_name,element_icon)
  {
    canvas_consecutive++;
    let current_id = "db_element_table_"+canvas_consecutive;
    canvas_objects_ids.push(current_id);

    let element_clone = `
      <div id="${current_id}" class="blockelem create-flowy noselect" style="background-color: white;">
        <input type="hidden" name='blockelemtype' class="blockelemtype" value="1">
        <div class="grabme">
          <img src="assets/img/icons/grabme.svg">
        </div>
        <div class="blockin">
          <div class="blockico">
            <span></span>
            <img src="assets/img/icons/${element_icon}"/>
          </div>
          <div class="blocktext">
            <p class="blocktitle" contenteditable="true">${element_name}</p>
            <p class="blockdesc" contenteditable="true">Table description</p>
          </div>
          <br>
        </div>
        
        <!-- code here -->
        <div>
            <ul class="menu-list"></ul>
            <ul class="menu-list fields"></ul>
            <ul class="menu-list">
              <li class="menu-item">
                <button class="menu-button add-field" data-id="${current_id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
              
                  <span>Add column</span>
                  <span>CTRL+A</span>
                </button>
              </li>
              <li class="menu-item">
                <button class="menu-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                  </svg>
              
                  <span><a href="#" data-id="${current_id}" class="connect" style="text-decoration: none;">Connect</a></span>
                  <span>CTRL+E</span>
                </button>
              </li>
            </ul>
        </div>

      </div>
    `;

    let canvas_clone  = document.getElementById("canvas").cloneNode(true);
    
    $("#canvas").remove();

    $("body").append(canvas_clone);
    
    if($(`#${current_id}`).length == 0)
    {
      $("#canvas").append(element_clone);
    }
  }

  function refresh_canvas()
  {
    canvas_objects_ids.forEach(function(current_id){
      let draggable = new PlainDraggable(document.getElementById(current_id),{handle: document.querySelector(`#${current_id} .grabme`)});
      canvas_objects_draggable.set(current_id,draggable);
    });

    let temp_lines = [];
    canvas_objects_lines.forEach(function(current_line, index, object){
      let line = new LeaderLine(document.getElementById(current_line.start.id), document.getElementById(current_line.end.id));
      temp_lines.push(line);
      current_line.remove();
    });
    canvas_objects_lines = temp_lines;

    canvas_objects_lines.forEach(function(current_line){
      canvas_objects_draggable.get(current_line.start.id).onMove = function() { 
        canvas_objects_lines.forEach(function(current_line){
          current_line.position();
        });
      };
      canvas_objects_draggable.get(current_line.end.id).onMove = function() { 
        canvas_objects_lines.forEach(function(current_line){
          current_line.position();
        });
      };
    });

    // Event listener for Connect
    $(".connect").on("click",function(e){
      e.preventDefault();
      let current_id = $(this).attr("data-id");
      if(fields_connect.length == 0)
      {
        fields_connect.push($(`#${current_id}`)[0]);
      }
      else
      {
        let line = new LeaderLine(fields_connect[0], $(`#${current_id}`)[0]);
        canvas_objects_lines.push(line);

        canvas_objects_draggable.get(fields_connect[0].id).onMove = function() { 
          canvas_objects_lines.forEach(function(current_line){
            current_line.position();
          });
        };
        canvas_objects_draggable.get(current_id).onMove = function() { 
          canvas_objects_lines.forEach(function(current_line){
            current_line.position();
          });
        };

        fields_connect = [];
      }

    });

    // Add new field
    $(".add-field").on("click",function(){
      let table_id = $(this).attr("data-id");
      $(`#${table_id} ul.fields`).append(`
        <li class="menu-item">
          <button class="menu-button">
            <svg ></svg>
      
            <span contenteditable="true">new field</span>
            <span><span contenteditable="true">TEXT</span> </span>
          </button>
        </li>
      `);
    });

  }
  
});
