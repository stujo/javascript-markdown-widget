function MarkdownModel(startValue) {
    var input = ""

    setInput(startValue);

    function setInput(newInput) {
        if (newInput === undefined) {
            input = ""
        } else {
            input = newInput.trim();
        }
    }

    function getPreview() {
        var output = input;

        MarkdownModel.MAPPINGS.forEach(function(mapping) {
            output = output.replace(mapping.regex, mapping.replace);
        });
        return output;
    }

    return {
        setInput: setInput,
        getPreview: getPreview
    }
}

MarkdownModel.addMapping = function(label, regex, replace) {
    MarkdownModel.MAPPINGS = MarkdownModel.MAPPINGS || [];
    MarkdownModel.MAPPINGS.push({label: label, regex: regex, replace: replace })
}

// MAPPINGS
MarkdownModel.addMapping('italic', /\*\*([^\*]*)\*\*/g, '<em>$1</em>');
MarkdownModel.addMapping('bold', /\*([^\*]*)\*/g, '<b>$1</b>');
MarkdownModel.addMapping('bullet', /^(\s)*\+(.*)$/gm, '<li>$2</li>');


module.exports = MarkdownModel;
