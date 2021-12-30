let canvas_objects_draggable = new Map();
let canvas_objects_lines = [];
let canvas_objects_ids = [];
let fields_connect = [];
let canvas_consecutive = 0;

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

  // New Process
  dragula([document.getElementById("db_element_process"), document.getElementById("canvas")], {
    copy: true
  }).on('drop', function (el) {
    this.remove();

    add_element_to_canvas("New process","process.svg");
    refresh_canvas(); 

  });

  function add_element_to_canvas(element_name,element_icon)
  {
    canvas_consecutive++;
    let current_id = "db_element_table_"+canvas_consecutive;
    let element_clone = `
      <div id="${current_id}" class="canvas_blockelem blockelem create-flowy noselect" style="background-color: white;">
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
            <p class="blockdesc" contenteditable="true">Description</p>
            <div class="blockclose">
              <svg data-id="${current_id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
            </div>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                  </svg>
              
                  <span><a href="#" data-id="${current_id}" class="connect" style="text-decoration: none;">Connect</a></span>
                  <span>CTRL+E</span>
                </button>
              </li>
              <li class="menu-item">
                <button class="menu-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-right" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"/>
                  </svg>
              
                  <span><a href="#" data-id="${current_id}" class="disconnect" style="text-decoration: none;">Disconnect</a></span>
                  <span>CTRL+E</span>
                </button>
              </li>
            </ul>
        </div>

      </div>
    `;
    canvas_objects_ids.push(current_id);

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

    if(canvas_objects_lines.length > 0)
    {
      let temp_lines = [];
      canvas_objects_lines.forEach(function(current_line){
        let line = new LeaderLine(document.getElementById(current_line.start.id), document.getElementById(current_line.end.id),{color: 'rgba(30, 130, 250, 0.9)'});
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
    }


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
        let line = new LeaderLine(fields_connect[0], $(`#${current_id}`)[0],{color: 'rgba(30, 130, 250, 0.9)'});
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

    // Event listener for Disconnect
    $(".disconnect").on("click",function(e){
      e.preventDefault();
      let current_id = $(this).attr("data-id");
      let remove_ids = [];

      canvas_objects_lines.forEach(function(value,index){
        if(value.start.id == current_id || value.end.id == current_id)
        {
          value.remove();
          remove_ids.push(index);
        }
      });
      remove_ids.reverse();
      remove_ids.forEach(function(item){
        canvas_objects_lines.splice(item, 1);
      });
      
      let canvas_clone  = document.getElementById("canvas").cloneNode(true);    
      $("#canvas").remove();
      $("body").append(canvas_clone);
      
      refresh_canvas();
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

    // Remove element from canvas
    $(".blockclose svg").on("click",function(){
      let current_id = $(this).attr("data-id");
      let remove_ids = [];

      canvas_objects_lines.forEach(function(value,index){
        if(value.start.id == current_id || value.end.id == current_id)
        {
          value.remove();
          remove_ids.push(index);
        }
      });
      remove_ids.reverse();
      remove_ids.forEach(function(item){
        canvas_objects_lines.splice(item, 1);
      });
      
      let remove_id = 0;
      canvas_objects_ids.forEach(function(value,index){
        if(current_id == value)
          remove_id = index;
      });
      canvas_objects_ids.splice(remove_id, 1);
      canvas_objects_draggable.delete(current_id);

      $(`#${current_id}`).remove();

    });

  }

  // Export diagram to png
  $("#publish").on("click",function(e){
    html2canvas(document.getElementById("canvas")).then(function (canvas) {			
      canvas.toBlob(function(blob) {
        saveAs(blob, "diagram_01.png");
      });
    });
  });
  
});
