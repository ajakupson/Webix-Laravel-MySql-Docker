(function () {
    const { NONCONFORMITY_TYPE_OPTIONS, UNIT_OPTIONS } = window.MetaPrintConstants;

    function createNonconformityForm(onSave, onClear) {
        return {
            view: "form",
            id: "nonconformityForm",
            padding: { top: 10, left: 10, right: 10, bottom: 10 },
            elementsConfig: {
                labelWidth: 110
            },
            elements: [

                {
                    cols: [
                        {
                            view: "text",
                            name: "barcode",
                            label: "Vöötkood",
                            labelPosition: "top",
                            required: true,
                            fillspace: true
                        }
                    ]
                },

                {
                    cols: [
                        {
                            view: "richselect",
                            name: "type_code",
                            label: "Tüüpikirjeldus",
                            labelPosition: "top",
                            required: true,
                            options: NONCONFORMITY_TYPE_OPTIONS,
                            fillspace: true
                        },
                        {
                            view: "text",
                            name: "quantity",
                            label: "Kogus",
                            labelPosition: "top",
                            required: true,
                            width: 180
                        },
                        {
                            view: "combo",
                            name: "unit",
                            label: "Ühik",
                            labelPosition: "top",
                            required: true,
                            options: UNIT_OPTIONS,
                            width: 150
                        }
                    ]
                },

                {
                    view: "textarea",
                    name: "comment",
                    label: "Kommentaar",
                    labelPosition: "top",
                    height: 120,
                    fillspace: true,
                    required: true
                },

                {
                    cols: [
                        {
                            view: "template",
                            template: "Keela kasutamist",
                            borderless: true,
                            width: 150,
                            css: { "line-height": "32px" }
                        },
                        {
                            view: "checkbox",
                            name: "disabled",
                            labelWidth: 0,
                            width: 40,
                            css: "checkbox-right"
                        },
                        {}
                    ]
                },

                {
                    cols: [
                        {},

                        {
                            view: "uploader",
                            id: "fileUploader",
                            name: "files",
                            accept: "image/*,application/pdf",
                            multiple: true,
                            autosend: false,
                            link: "fileList",
                            width: 1,
                            height: 1,
                            css: "hidden-uploader",
                            on: {
                                onBeforeFileAdd: function (file) {
                                    if (file.size > 10 * 1024 * 1024) {
                                        webix.message({ type: "error", text: "Fail on liiga suur (max 10 MB)" });
                                        return false;
                                    }
                                }
                            }
                        },

                        {
                            view: "button",
                            id: "filePickerButton",
                            label: "<span class='material-icons'>attach_file</span>Vali fail(id)",
                            width: 160,
                            css: "btn btn-default",
                            click: function () {
                                $$("fileUploader").fileDialog();
                            }
                        },

                        { width: 15 },

                        {
                            view: "button",
                            value: "Salvesta",
                            width: 140,
                            css: "btn btn-green",
                            click: function () {
                                const form = $$("nonconformityForm");
                                if (!form.validate()) return;

                                let values = form.getValues();
                                values.quantity = parseInt(values.quantity, 10);
                                values.disabled = !!values.disabled;
                                values.created_by = "developer";

                                onSave(values, $$("fileUploader"));
                            }
                        },

                        { width: 15 },

                        {
                            view: "button",
                            value: "Puhasta",
                            width: 140,
                            css: "btn btn-default",
                            click: onClear
                        }
                    ]
                }
            ],

            rules: {
                barcode: webix.rules.isNotEmpty,
                type_code: webix.rules.isNotEmpty,
                unit: webix.rules.isNotEmpty,
                comment: webix.rules.isNotEmpty,
                quantity: function (value) {
                    const n = parseInt(value, 10);
                    return !isNaN(n) && n > 0;
                }
            }
        };
    }

    window.MetaPrintComponents = window.MetaPrintComponents || {};
    window.MetaPrintComponents.createNonconformityForm = createNonconformityForm;

})();