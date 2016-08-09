function MarkdownView($, $previewContainer) {

  function refresh(model) {
     var preview = model.getPreview();
     $previewContainer.html(preview);
  }

  return {
    refresh: refresh
  }
}

module.exports = MarkdownView;
