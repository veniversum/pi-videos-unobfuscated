function exit( status ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brettz9.blogspot.com)
    // +      input by: Paul
    // +   bugfixed by: Hyam Singer (http://www.impact-computing.com/)
    // +   improved by: Philip Peterson
    // +   bugfixed by: Brett Zamir (http://brettz9.blogspot.com)
    // %        note 1: Should be considered expirimental. Please comment on this function.
    // *     example 1: exit();
    // *     returns 1: null

    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {stopPropagation(e);}, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}
let foo
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
let e;
d3.select("#energy").style("width",width)

svg.append("defs")
    .append("marker")
    .attr("id", "ahead" )
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 25)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
    .style("stroke", "#4679BD")
    .style("opacity", "0.6");

var color = d3.scaleOrdinal(d3.schemeCategory20);
var max = Math.pow(2,2.5),
    min = Math.pow(2,-3.5),
    mean = Math.sqrt(max * min)
var x = d3.scaleLinear().domain([0, width]).range([0, width]);
var y = d3.scaleLog().base(2).domain([min,max]).range([height -20 , 20]).clamp(true);

var superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹",
    formatPower = function(d) { return (d + "").split("").map(function(c) { return superscript[c]; }).join(""); };
var yAxis = d3.axisLeft(y)
//  .ticks(9)
    .tickValues([-3,-2,-1,0,1,2].map(d => Math.pow(2,d)))
    .tickFormat(Math.log2)


svg.append("g")
    .attr("transform","translate(30,0)")
    .attr("class", "y axis")
    .call(yAxis);

let graph = {links:[],nodes:[]};
d3.json("PIlog2017.json", function(error, rankings) {
    if (error) throw error;

    let ranks = {},
	videos = {},
	markers = []

    rankings.forEach( r => {
	ranks[r.markerUUN] = r; // this means we get the last ranking for each marker
    })

    for (marker in ranks){
	let r = ranks[marker];
	let scores = {
	    relevance:[[],[],[]],
	    content:[[],[],[]],
	    presentation:[[],[],[]]
	}
	for (k in r) {
	    let m = k.match(/(s[0-9]*)(relevance|content|presentation)/);
	    if (m){ 
		if (! videos[m[1]]) { videos[m[1]] = { id:m[1], ra:[],rb:[],ca:[],cb:[],pa:[],pb:[]};}
		scores[m[2]][1 - r[k]].push(m[1]); // top-ranked first
	    }
	}
	
	r.scores = scores;
    }

    
    
    for (marker in ranks) {
	markers.push( marker);
	let r = ranks[marker];
	r.energy={};
	for (k1 in r)// k1 (a) is ranked lower{
	    if (k1.match(/presentation/)){
		for (k2 in r)
		    if (k2.match(/presentation/) && r[k1] > r[k2] ){ // k2 (b) is ranked lower
			let a = k1.replace(/presentation/,""), b = k2.replace(/presentation/,"")
			if (! videos[a] ) { videos[a] = { id:a,A:1,B:1, ra:[],rb:[],ca:[],cb:[],pa:[],pb:[]}}
			if (! videos[b] ) { videos[b] = { id:b,A:1,B:1, ra:[],rb:[],ca:[],cb:[],pa:[],pb:[]}}
			videos[a].pa.push(b);
			videos[b].pb.push(a);
		    }
	    }
	if (k1.match(/presentation/)){
	    for (k2 in r)
		if (k2.match(/content/) && r[k1] > r[k2] ){ // k2 (b) is ranked lower
		    let a = k1.replace(/content/,""), b = k2.replace(/content/,"")
		    if (! videos[a] ) { videos[a] = { id:a,A:1,B:1, ra:[],rb:[],ca:[],cb:[],pa:[],pb:[]}}
		    if (! videos[b] ) { videos[b] = { id:b,A:1,B:1, ra:[],rb:[],ca:[],cb:[],pa:[],pb:[]}}
		    videos[a].ca.push(b);
		    videos[b].cb.push(a);
		}
	}
	if (k1.match(/presentation/)){
	    for (k2 in r)
		if (k2.match(/relevance/) && r[k1] > r[k2] ){ // k2 (b) is ranked lower
		    let a = k1.replace(/relevance/,""), b = k2.replace(/relevance/,"")
		    if (! videos[a] ) { videos[a] = { id:a,A:1,B:1, ra:[],rb:[],ca:[],cb:[],pa:[],pb:[]}}
		    if (! videos[b] ) { videos[b] = { id:b,A:1,B:1, ra:[],rb:[],ca:[],cb:[],pa:[],pb:[]}}
		    videos[a].ra.push(b);
		    videos[b].rb.push(a);
		}
	}
    }


    function jiggle() {
	return (Math.random() * 100 -50);
    }
    
    for (v in videos) {
	videos[v].x = width/2 + jiggle() ;
	videos[v].y = height/3 + jiggle();
	graph.nodes.push(videos[v]);
    }
    for (v in videos){
    	videos[v].ra.forEach(w => graph.links.push({type:"relevance",source:videos[w],target:videos[v]}));
	videos[v].ca.forEach(w => graph.links.push({type:"content",source:videos[w],target:videos[v]}));
	videos[v].pa.forEach(w => graph.links.push({type:"presentation",source:videos[w],target:videos[v]}));
    }



    function tri(){
	let mye = 0
	for (marker in ranks) {
	    let r = ranks[marker],
		scores = r.scores;
	    for (criterion in scores)
		if (document.getElementById(criterion).checked)
	    {
		I = scores[criterion]
		    .map( i => 
			  ({
			      m:Math.pow( //geometric mean
				  i.reduce((a,w) => a* y.invert(videos[w].y),1)
				  ,1/(i.length==0?1:i.length)),
			      n:i.length  //count
			  })
			)

		J  = scores[criterion]
		    .map( (x,i) => 
			  x.reduce((a,w) => a + 1/(I[i].m + y.invert(videos[w].y)),0)/I[i].n			 
			)

		
		let GARi     = 1/d3.sum(I, d => d.m),      // 1/(G + A + R)
		    ARi      = 1/(I[1].m + I[2].m)        // 1/(A + R)

		r.energy[criterion] =
		    I[0].n*(Math.log(I[0].m) + Math.log(GARi))
		    +
		    I[1].n*(Math.log(I[1].m) + Math.log(ARi))
		
		scores[criterion][0]
		    .forEach( w => {
			let wy = y.invert(videos[w].y),
			    f0 = 2 - I[0].m * (GARi + J[0])
			videos[w].vy -=  f0  -2 * wy /(I[0].m + wy)})
		scores[criterion][1]
		    .forEach( w => {
			let wy = y.invert(videos[w].y),
			    f1 = 2 -  I[1].m*(I[0].n * GARi/I[1].n + ARi + J[1])
			videos[w].vy -=  f1  - wy /(I[1].m + wy)})
		scores[criterion][2]
		    .forEach( w => { 
			let wy = y.invert(videos[w].y),
			    f2 = 1 -I[2].m*(I[0].n * GARi/I[2].n + I[1].n * ARi/I[2].n +J[2])
			videos[w].vy -=  f2  -  wy /(I[2].m + wy) })
		mye -= r.energy[criterion]
		
	    }
	}
	foo = ranks
	e = mye; 
    }
    function shatter(){ // spread horizontally
	graph.nodes.forEach(node => { node.x += jiggle() })
    }

    var simulation = d3.forceSimulation().alpha(1).alphaDecay(0.0001).velocityDecay(0.25)
	.force("x",d3.forceX().x(width/2).strength(0.002))
    //  .force("y",d3.forceY().y(height/2).strength(0.3))
	.force("collide", d3.forceCollide().radius(6))
    	.force("center", d3.forceCenter(width / 2, y(1)))
    	.force("BT",tri)
    //	.stop()

    d3.selectAll("input[type=checkbox]")
	.on("change", () => {shatter();simulation.alpha(1).restart();})


    var links = svg.append("g")
	.attr("class", "links")
	.style("marker-end",  "url(#ahead)") // Modified line 


    var node = svg.append("g")
	.attr("class", "nodes")
	.selectAll("circle")
	.data(graph.nodes)
	.enter().append("circle")
	.attr("r", 5)
	.attr("fill", function(d) { return color(d.group); })

	.on("click", link)
	.call(d3.drag()
	      .on("start", dragstarted)
	      .on("drag", dragged)
	      .on("end", dragended));

    node.append("title")
	.text(function(d) { return d.id; });

    simulation
	.nodes(graph.nodes)
	.on("tick", ticked);

    svg.on("click",clear)

    function clear(){
	simulation.alpha(1).restart();
	links.selectAll("line")
	    .data([]) 
	    .exit().remove()
    }

    function link(d){
	d3.event.stopPropagation();
	simulation.alpha(1).restart();
	let s =	links.selectAll("line")
	    .data(d.ra.map( t => ({type:"relevance",source:videos[d.id],target:videos[t]}) )
		  .concat(d.rb.map(s => ({type:"relevance",source:videos[s],target:videos[d.id]})))
		  .concat(d.ca.map(s => ({type:"content",source:videos[s],target:videos[d.id]})))
		  .concat(d.cb.map(s => ({type:"content",source:videos[s],target:videos[d.id]})))
		  .concat(d.pa.map(s => ({type:"presentation",source:videos[s],target:videos[d.id]})))
		  .concat(d.pb.map(s => ({type:"presentation",source:videos[s],target:videos[d.id]})))
		 )
	    
    
	s.enter()
	    .filter(d => document.getElementById(d.type).checked)
	    .append("line")
	    .merge(s)
    
	s.exit().remove()
}

	function dragstarted() {
	    d3.select("iframe")
		.attr("src",
		      d =>
		      "http://homepages.inf.ed.ac.uk/"
		      + d3.event.subject.id
		      .replace(/([0-9]{2})([0-9]{2})([0-9])([0-9]{2})/,"$3$2$4$1")
		      +"/pi-video-2017/")
	    if (!d3.event.active) simulation.alpha(1).alphaTarget(0.001).restart();
	    d3.event.subject.fx = d3.event.subject.x;
	    d3.event.subject.fy = d3.event.subject.y;
	}

	function dragged() {
	    d3.event.subject.fx = d3.event.x;
	    d3.event.subject.fy = d3.event.y;
	}

	function dragended() {
	    if (!d3.event.active) simulation.alphaTarget(0.001);
	    d3.event.subject.fx = null;
	    d3.event.subject.fy = null;
	}


	function ticked() {
	    d3.selectAll(".links line")
		.attr("x1", d => d.source.x )
		.attr("y1", d => d.source.y )
		.attr("x2", d => d.target.x )
		.attr("y2", d => d.target.y  );
	    d3.select(".energy")
		.text(d3.format(".2f")(e))
	    node
		.attr("cx", d => d.x)
		.attr("cy", d => d.y);

	    if (document.getElementById("stop").checked) {simulation.stop(); return;}
	}





       });
