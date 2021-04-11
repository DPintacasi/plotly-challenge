d3.json("../data/samples.json").then(function(data){

    console.log(data)

    // populate dropdown

    var dropdown = d3.select("#selDataset");

    var names = data.names;

    names.forEach(function(name){
        var option = dropdown.append("option");
        option.text(name);
    });

    // initial dashboard

    buildDashboard("940")

    // click event
    
    dropdown.on("change", buildDashboard);

    // event handler

    function buildDashboard(){

        // d3.event.preventDefault();

        var ID = dropdown.property("value");
        console.log(ID);

        // demographic info

        var metadata = data.metadata;

        for (var i = 0; i < metadata.length; i++){
            if(metadata[i].id === parseInt(ID)){
                console.log(`Data Found for ID ${ID}`);
                var demoData = metadata[i];
                break;
            } 
        }

        var demoPanel = d3.select("#sample-metadata");

        demoPanel.html("")

        Object.entries(demoData).forEach(function([key, value]){
            var line = demoPanel.append("p");
            line.text(`${key}: ${value}`);
        });

        // bar chart

        var samples = data.samples;

        for (var i = 0; i < samples.length; i++){
            if(samples[i].id === ID){
                console.log(`Data Found for ID ${ID}`);
                var sampleData = samples[i];
                break;
            } 
        };

        var bar_data = [{
            x: sampleData.sample_values.slice(0,10).reverse(),
            y: sampleData.otu_ids.slice(0,10).reverse().map(function(id){
                return `OTU ${id}`
            }),
            type: "bar",
            text: sampleData.otu_labels.slice(0,10).reverse(),
            orientation: "h",
        }];

        var bar_layout = {
            title: `Top 10 OTUs found in ${ID}`
        };

        Plotly.newPlot("bar", bar_data, bar_layout);

        // bubble

        var bubble_data = [{
            y: sampleData.sample_values,
            x: sampleData.otu_ids,
            type: "bubble",
            text: sampleData.otu_labels,
            mode: "markers",
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids
            }    
        }];

        var bubble_layout = {};

        Plotly.newPlot("bubble", bubble_data, bubble_layout);

        // gauge

        var gauge_data = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: demoData.wfreq,
            // title: { text: "Speed" },
            type: "indicator",
            mode: "gauge+number",
            gauge: { axis: { range: [null, 9] } }
        }];

        var gauge_layout = {};

        Plotly.newPlot("gauge", gauge_data, gauge_layout);
        

    };
});





