const timeline_a = document.querySelector("timeline-a");
const timeline_json = JSON.parse(timeline_a.textContent);

function create_timeline(data){    
    timeline_a.setAttribute("snap_point", 0);
    timeline_a.classList.add("start");
    timeline_a.classList.add("not_interacted_with");
    timeline_a.innerHTML = "";
    
    var snap_observer = new MutationObserver(function(mutations){
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === "snap_point") {
                if(timeline_a.classList.contains("not_interacted_with")){
                    timeline_a.classList.remove("not_interacted_with");
                    var cirlce_animation = timeline_a.querySelector("circle.radar");
                    cirlce_animation.remove();
                }
                var new_index = timeline_a.getAttribute("snap_point");

                const timeline = timeline_a.querySelector(".timeline");
                const anchor_divs = timeline.querySelectorAll("div.anchor");

                anchor_divs.forEach((anchor_div) =>{
                    anchor_div.classList.remove("selected");
                    if(anchor_div.getAttribute("snap_point_index") == new_index){
                        anchor_div.classList.add("selected");
                    }
                })

                const selected_content = timeline.querySelector("div.anchor.selected");
                var index = Array.from(selected_content.parentNode.children).indexOf(selected_content);
                timeline.style.transform = `translateY(${(index -1) * -1 * (distance_between_circles + circle_diameter)}px)`;
                

                const content_holder = timeline_a.querySelector("div.content_holder");
                var content_height = content_holder.firstElementChild.getBoundingClientRect().height;
                content_holder.style.transform = `translateY(${(new_index) * -1 * content_height}px)`;                                                                
            }
        });
    })

    snap_observer.observe(timeline_a, {attributes: true});

    let timeline = document.createElement("div");
    timeline.classList.add("timeline");

    let div_two = document.createElement("div");
    div_two.classList.add("div_two");
    let section_title = document.createElement("h3");
    section_title.innerHTML = timeline_json.section_title;
    div_two.appendChild(section_title);
    let div_two_flex_div = document.createElement("div");
    div_two_flex_div.classList.add("flex_div");
    let content_holder = document.createElement("div");
    content_holder.classList.add("content_holder");                    

    //#region SVG set up
    const distance_between_circles = 85;
    const circle_diameter = 46;
    let base_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    base_svg.setAttribute("width","64");
    base_svg.setAttribute("height",`${distance_between_circles + circle_diameter}`);
    base_svg.setAttribute("viewBox",`0 0 64 ${distance_between_circles + circle_diameter}`);
    var base_svg_path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    base_svg_path.setAttribute("d",`M32 0 L32 ${distance_between_circles + circle_diameter}`);
    base_svg_path.setAttribute("stroke","#30225E");
    base_svg_path.setAttribute("stroke-width","2");
    base_svg_path.setAttribute("stroke-miterlimit","10");
    var base_svg_circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
    base_svg_circle.setAttribute("cx","32");
    base_svg_circle.setAttribute("cy",`${(distance_between_circles + circle_diameter) / 2}`);
    base_svg_circle.setAttribute("r",`${circle_diameter / 2}`);
    base_svg_circle.setAttribute("fill","#FFFFFF");
    base_svg_circle.setAttribute("stroke","#30225E");
    base_svg_circle.setAttribute("stroke-width","2");
    base_svg_circle.setAttribute("stroke-miterlimit","10");
    base_svg.appendChild(base_svg_path);
    base_svg.appendChild(base_svg_circle);
    //#endregion

    var first_item = true;
    var snap_point_index = 0;
    data.forEach((data_item) => {
        var curr_index = data.indexOf(data_item);
        let div = document.createElement("div");
        // if(first_item){div.classList.add("first");}

        let svg_copy = base_svg.cloneNode(true);
        var svg_copy_circle = svg_copy.querySelector("circle");;
        var svg_copy_path = svg_copy.querySelector("path");
        if(first_item){
            svg_copy_path.setAttribute("d",`M32 ${(distance_between_circles + circle_diameter) / 2} L32 ${distance_between_circles + circle_diameter}`);
        }
        else if(data.indexOf(data_item) == data.length - 1){
            svg_copy_path.setAttribute("d",`M32 0 L32 ${(distance_between_circles + circle_diameter) / 2}`);
        }

        switch(data_item.TYPE){
            case "YEAR":
                div.classList.add("year");
                
                svg_copy_circle.setAttribute("fill","#30225e");

                div.appendChild(svg_copy);

                let year_h4 = document.createElement("h4");
                year_h4.innerHTML = data_item.CONTENT;
                
                div.appendChild(year_h4);

                let year_h4_mobile = document.createElement("h4");
                year_h4_mobile.classList.add("mobile_h4");
                year_h4_mobile.innerHTML = "'" + (`${data_item.CONTENT - 2000}`).padStart(2, '0');

                div.appendChild(year_h4_mobile);
                break;
            case "ANCHOR":
                div.classList.add("anchor");
                if(snap_point_index == 0){
                    div.classList.add("selected");
                }
                if(snap_point_index == 1){
                    var base_svg_circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                    base_svg_circle.setAttribute("cx","32");
                    base_svg_circle.setAttribute("cy",`${(distance_between_circles + circle_diameter) / 2}`);
                    base_svg_circle.setAttribute("r",`${circle_diameter / 2}`);
                    base_svg_circle.setAttribute("fill","#8067DF");
                    base_svg_circle.setAttribute("stroke","#30225E");
                    base_svg_circle.setAttribute("stroke-width","2");
                    base_svg_circle.setAttribute("stroke-miterlimit","10");
                    base_svg_circle.classList.add("radar");
                    svg_copy.appendChild(base_svg_circle);
                    svg_copy.appendChild(svg_copy_circle);
                }
                div.setAttribute("snap_point_index", snap_point_index);

                //Arrow
                let arrow_div = document.createElement("div");
                arrow_div.classList.add("arrow_div");
                let arrow_line = document.createElement("div");
                arrow_line.classList.add("arrow_line");
                let arrow = document.createElement("div");
                arrow.classList.add("arrow");
                let arrow_top = document.createElement("div");
                arrow_top.classList.add("arrow_top");
                let arrow_bottom = document.createElement("div");
                arrow_bottom.classList.add("arrow_bottom");
                arrow.appendChild(arrow_top);
                arrow.appendChild(arrow_bottom);

                arrow_div.appendChild(arrow_line);
                arrow_div.appendChild(arrow);
                
                div.appendChild(svg_copy);
                div.appendChild(arrow_div);
                
                //div two
                let content_div = document.createElement("div");
                content_div.classList.add("content_div");
                content_div.setAttribute("snap_point_index", snap_point_index);
                if(snap_point_index == 0){
                    content_div.classList.add("selected");
                }
                if(data_item.CONTENT.TITLE){
                    let title = document.createElement("h4");
                    title.innerHTML = data_item.CONTENT.TITLE;
                    content_div.appendChild(title);
                }
                if(data_item.CONTENT.TEXT){
                    let description = document.createElement("p");
                    description.innerHTML = data_item.CONTENT.TEXT;
                    content_div.appendChild(description);
                }
                if(data_item.CONTENT.MEDIA){
                    let media = document.createElement("img");
                    media.setAttribute("src", data_item.CONTENT.MEDIA);
                    content_div.appendChild(media);
                }
                
                content_holder.appendChild(content_div);

                snap_point_index++;
                break;
            case "MILESTONE":
                div.classList.add("milestone");
                
                div.appendChild(svg_copy);

                let milestone_text = document.createElement("p");
                milestone_text.innerHTML = data_item.CONTENT;

                div.appendChild(milestone_text);
                break;
            default:
                break;
        }

        timeline.appendChild(div);            
        
        first_item = false;
    });                    

    div_two_flex_div.appendChild(content_holder);
    let snap_buttons_div = document.createElement("div");
    snap_buttons_div.classList.add("buttons_div");

    let prev_snap_point_button = document.createElement("button");
    prev_snap_point_button.classList.add("prev_btn");
    prev_snap_point_button.innerHTML = `
    <svg width="50" height="47" viewBox="0 0 50 47" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.999853 23.5C0.999852 11.1137 11.4944 1.00002 24.5314 1.00002C37.5685 1.00002 48.063 11.1137 48.063 23.5C48.063 35.8864 37.5685 46 24.5314 46C11.4944 46 0.999854 35.8864 0.999853 23.5Z" fill="white" stroke="#30235F" stroke-width="2"/>
        <path d="M14.0051 27.587L24.8096 15.7655L35.6035 27.587" stroke="#30225E" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
    `;

    let next_snap_point_button = document.createElement("button");
    next_snap_point_button.classList.add("next_btn");
    next_snap_point_button.innerHTML = `
    <svg width="50" height="47" viewBox="0 0 50 47" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.999853 23.5C0.999852 11.1137 11.4944 1.00002 24.5314 1.00002C37.5685 1.00002 48.063 11.1137 48.063 23.5C48.063 35.8864 37.5685 46 24.5314 46C11.4944 46 0.999854 35.8864 0.999853 23.5Z" fill="white" stroke="#30235F" stroke-width="2"/>
        <path d="M14.0051 27.587L24.8096 15.7655L35.6035 27.587" stroke="#30225E" stroke-width="2" stroke-miterlimit="10"/>
    </svg>
    `;
    next_snap_point_button.style.transform = "rotate(180deg)";

    snap_buttons_div.appendChild(prev_snap_point_button);
    snap_buttons_div.appendChild(next_snap_point_button);

    div_two_flex_div.appendChild(snap_buttons_div);
    div_two.appendChild(div_two_flex_div);

    timeline_a.appendChild(timeline);
    timeline_a.appendChild(div_two);
    timeline_a.setAttribute("snap_point_max", snap_point_index - 1);
    timeline_a.style.color = "";
}

function add_timeline_listeners(){
    const timeline = document.querySelector(".timeline");
    const anchor_divs = timeline.querySelectorAll("div.anchor");

    anchor_divs.forEach((anchor_div) =>{
        var circle = anchor_div.querySelector("circle:last-child");
        circle.addEventListener("click", () =>{
            content_clicked(anchor_div);
        })
    })

    function content_clicked(clicked_anchor_div){
        timeline_snap_to(clicked_anchor_div.getAttribute("snap_point_index"));
    }
}

create_timeline(timeline_json.data);
add_timeline_listeners();

function timeline_snap_to(snap_point){
    var max_snap_point = parseInt(timeline_a.getAttribute("snap_point_max"));
    if(0 <= snap_point && snap_point <= max_snap_point){
        timeline_a.setAttribute("snap_point", snap_point);

        if(snap_point == 0){
        timeline_a.classList.add("start");
        }
        else if(snap_point == max_snap_point){
            timeline_a.classList.add("end");
        }
        else{
            timeline_a.classList.remove("start");
            timeline_a.classList.remove("end");
        }   
    }                  
};
function timeline_snap_to_next(){
    var snap_point = parseInt(timeline_a.getAttribute("snap_point")) + 1;
    timeline_snap_to(snap_point);
};
function timeline_snap_to_prev(){
    var snap_point = parseInt(timeline_a.getAttribute("snap_point")) - 1;
    timeline_snap_to(snap_point);
};

const prev_btn = document.querySelector(".prev_btn");
prev_btn.addEventListener("click", () =>{
    timeline_snap_to_prev();
});

const next_btn = document.querySelector(".next_btn");
next_btn.addEventListener("click", () =>{
    timeline_snap_to_next();
});