// Creating function for plotting the sample data bar and bubble chart
function plot_samples(id) {
    // get data from the samples.json file

    d3.json("../data/samples.json").then((data) => {
        // log the data in order to visualize it for retrieving the samples
        console.log(data)

        // filter sample values by id first so that each visualiztion represents one individuals samples 
        var samples = data.samples.filter(sample => sample.id.toString() === id)[0];

        console.log(samples);

        // Get the top 10 samples, they are already in descending order which is why sorting is not required, reverse it for the graph
        var top10samples = samples.sample_values.slice(0, 10).reverse();

        // Get the top 10 otu_ids for the plot OTU and reverse it for the horizontal graph top-down
        var otu_top10 = (samples.otu_ids.slice(0, 10)).reverse();

        // Add the OTU text to the axis label otu numbers
        var otu_id = otu_top10.map(d => "OTU " + d)

        // Get the top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);

        // ------------------------------------------------------------------
        // ------------------------------------------------------------------

        // create the trace variable for the bar plot
        var samples_trace = {
            x: top10samples,
            y: otu_id,
            text: labels,
            marker: {
                color: 'rgb(0,76,153)'
            },
            type: "bar",
            orientation: "h",
        };

        // create data variable for the samples
        var data = [samples_trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU (microbial species)",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

        // -----------------------------------------------------------------------
        // -----------------------------------------------------------------------

        // Create the bubble chart
        var bubble_trace = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels

        };

        // set the layout for the bubble plot
        var layout_b = {
            xaxis: { title: "Sample Value by OTU ID" },
            showlegend: false,
            height: 600,
            width: 1000
        };

        // creating data variable 
        var data1 = [bubble_trace];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b);

    });
}
// create the function to get the data for demographics
function get_demographics(id) {
    // read the samples.json file to get data
    d3.json("../data/samples.json").then((data) => {

        // get the metadata info for the demographics visual on the webpage
        var metadata = data.metadata;

        console.log(metadata)

        // filter meta data info by id an indivual set of demographics matching the sample graph
        var result_id = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic id in order to add the sample demographics
        var demographicInfo = d3.select("#sample-metadata");

        // empty the demographic info each time before getting new info so that nothing is added to existing info displayed
        demographicInfo.html("");

        // get the necessary demographic data for the id and append the info to the sample-metadata panel in index.html
        Object.entries(result_id).forEach((key_value) => {
            demographicInfo.append("h5").text(key_value[0].toUpperCase() + ": " + key_value[1] + "\n");
        });
    });
}

// create the function for the id change event, so that the plots adjust to the new id selected, this is called in index.html
function optionChanged(id) {
    plot_samples(id);
    get_demographics(id);
}

// create the function for the initial data displayed on the webpage
function init() {
    // select dropdown menu in index.html 
    var dropdown = d3.select("#selDataset");

    // read the data from samples.json
    d3.json("../data/samples.json").then((data) => {
        console.log(data)

        // get the id data and append it to the dropdown so that it can be selected
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        plot_samples(data.names[0]);
        get_demographics(data.names[0]);
    });
}

init();