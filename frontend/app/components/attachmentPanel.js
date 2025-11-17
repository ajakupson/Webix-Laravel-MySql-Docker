(function () {
    function createAttachmentPanel() {
        return {
            view: "accordionitem",
            header: "<div class='accordion-header'>Lisa fail(id)</div>",
            body: {
                rows: [
                    {
                        view: "list",
                        id: "fileList",
                        type: "uploader",
                        scroll: "y",
                        borderless: false,
                        height: 160,
                        template: "#name#"
                    }
                ]
            }
        };
    }

    window.MetaPrintComponents = window.MetaPrintComponents || {};
    window.MetaPrintComponents.createAttachmentPanel = createAttachmentPanel;
})();