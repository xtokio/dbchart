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
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16" style="position: relative; top: 3px; left: -3px;">
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
            </svg>
          </div>
          <div class="blocktext">
            <p class="blocktitle" contenteditable="true">Users</p>
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
    
  });

  // New View
  dragula([document.getElementById("db_element_view"), document.getElementById("canvas")], {
    copy: true
  }).on('drop', function (el) {
    this.remove();

    canvas_consecutive++;
    let current_id = "db_element_view_"+canvas_consecutive;
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
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-border-outer" viewBox="0 0 16 16" style="position: relative; top: 3px; left: -3px;">
              <path d="M7.5 1.906v.938h1v-.938h-1zm0 1.875v.938h1V3.78h-1zm0 1.875v.938h1v-.938h-1zM1.906 8.5h.938v-1h-.938v1zm1.875 0h.938v-1H3.78v1zm1.875 0h.938v-1h-.938v1zm2.813 0v-.031H8.5V7.53h-.031V7.5H7.53v.031H7.5v.938h.031V8.5h.938zm.937 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zm1.875 0h.938v-1h-.938v1zM7.5 9.406v.938h1v-.938h-1zm0 1.875v.938h1v-.938h-1zm0 1.875v.938h1v-.938h-1z"/>
              <path d="M0 0v16h16V0H0zm1 1h14v14H1V1z"/>
            </svg>
          </div>
          <div class="blocktext">
            <p class="blocktitle" contenteditable="true">New View</p>
            <p class="blockdesc">Adds an empty view</p>
          </div>
        </div>

        <div>
          <ul class="menu-list"></ul>
          <ul class="menu-list"></ul>
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

    canvas_objects_ids.forEach(function(item){
      new PlainDraggable(document.getElementById(item),{handle: document.querySelector(`#${item} .grabme`)});
    });

  });
  
});
