
function App() {

    var model = new MarkdownModel();
    var view = new MarkdownView(jQuery, $('#preview'));

    function debouncer(callback, delay, preventDefault) {

        var timer, args, that;

        if (!delay) { delay = 300; }

        function debounce() {
            clearTimeout(timer);
            callback.apply(that, args);
        }

        return function(e) {
            if (preventDefault) { e.preventDefault(); }
            if (timer) { clearTimeout(timer); }
            args = arguments;
            that = this;
            timer = setTimeout(debounce, delay);
        }
    }

    function bind(){
        $('#input').on('change keyup paste', debouncer(function(e) {
            var $field = $(e.target);
            model.setInput($field.val());
            view.refresh(model);
        }));
      }

    function start() {
        bind();
        model.setInput($('#input').val());
        view.refresh(model);
    }

    return {
        start: start
    }
}

App().start();
