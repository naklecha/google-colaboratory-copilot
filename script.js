const generate = async (prompt) => {
    // Get your API key from storage
    const key = "<YOUR OPENAI API KEY>";
    const url = 'https://api.openai.com/v1/completions';

    // Call completions endpoint
    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'code-davinci-002',
            prompt: prompt,
            max_tokens: 1000,
            temperature: 0,
            stop: ["Question:"]
        }),
    });

    // Select the top choice and send back
    const completion = await completionResponse.json();
    return completion.choices.pop()["text"];
}

document.addEventListener("keydown", async (event) => {
    if (event.shiftKey && event.altKey && event.code === "Enter") {
                
        s = ""
        for(var i=0; i<window.colab.global.notebook.cells.length; i++) { 
            if(window.colab.global.notebook.focusedCell == window.colab.global.notebook.cells[i]) break; 
            s = "\n\n"+window.colab.global.notebook.cells[i].getText()
        }
        var prompt = window.colab.global.notebook.focusedCell.getText();
        var text = "A solution manual which has FAQs and answers without quotation marks in Python 3 for Google Colab notebooks\n\nQuestion: "+prompt +"\nAppend code to this:"+s+"\nAnswer:";
        window.colab.global.notebook.focusedCell.setText("'''\n\nthis may take a few seconds...\n\nprompt: \""+prompt+"\"\n\n'''");
        var output = (await generate(text)).trim();
        var c = "\n";
        var re = new RegExp("^[" + c + "]+|[" + c + "]+$", "g");
        output = output.replace(re,"");
        c = "`";
        re = new RegExp("^[" + c + "]+|[" + c + "]+$", "g");
        output = output.replace(re,"");
        window.colab.global.notebook.focusedCell.setText(output.trim());
    }
});
