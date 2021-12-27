$(document).ready(function(){

  let canvas_objects_ids = [];
  let canvas_consecutive = 0;

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
            <img src="assets/img/icons/table.svg">
          </div>
          <div class="blocktext">
            <p class="blocktitle" contenteditable="true">New table</p>
            <p class="blockdesc">Adds an empty table to the diagram</p>
          </div>
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

  // New View
  dragula([document.getElementById("db_element_view"), document.getElementById("canvas")], {
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
            <img src="assets/img/icons/view.svg">
          </div>
          <div class="blocktext">
            <p class="blocktitle" contenteditable="true">New View</p>
            <p class="blockdesc">Adds an empty view</p>
          </div>
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
