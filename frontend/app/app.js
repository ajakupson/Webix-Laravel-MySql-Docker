webix.ready(function () {
    const Components = window.MetaPrintComponents;
    const Api = window.MetaPrintApi;

    function mapFilesToListItems(files) {
        return (files || []).map(f => ({
            id: f.id,
            name: f.original_name,
            url: f.url,
            status: "server"
        }));
    }

    function clearFormAndFiles() {
        $$("nonconformityForm").clear();
        $$("nonconformityForm").clearValidation();
        $$("fileList").clearAll();
        const uploader = $$("fileUploader");
        if (uploader && uploader.files) {
            uploader.files.clearAll();
        }
    }

    function reloadNonconformityTable() {
        Api.getNonconformities()
            .then(function (items) {
                const table = $$("nonconformityTable");
                table.clearAll();
                table.parse(items);
            })
            .catch(function (err) {
                webix.message({ type: "error", text: "Viga andmete laadimisel" });
                console.error(err);
            });
    }

    function saveNonconformity(values, uploader) {
        const isUpdate = !!values.id;
        const action = isUpdate
            ? Api.updateNonconformity(values.id, values)
            : Api.createNonconformity(values);

        action
            .then(function (item) {
                if (uploader && uploader.files && uploader.files.count()) {
                    return Api.uploadFiles(item.id, uploader)
                        .then(function () {
                            webix.message("Kirje ja failid salvestatud");
                        });
                } else {
                    webix.message("Kirje salvestatud");
                }
            })
            .then(function () {
                clearFormAndFiles();
                reloadNonconformityTable();
            })
            .catch(function (err) {
                webix.message({ type: "error", text: "Salvestamine ebaõnnestus" });
                console.error(err);
            });
    }

    function updateQuantityInline(id, quantity) {
        Api.updateNonconformity(id, { quantity })
            .then(function () {
                webix.message("Kogus uuendatud");
            })
            .catch(function (err) {
                webix.message({ type: "error", text: "Uuendamine ebaõnnestus" });
                console.error(err);
                reloadNonconformityTable();
            });
    }

    function deleteNonconformityWithConfirm(item) {
        webix.confirm("Kustuta kirje ID " + item.id + "?").then(function () {
            Api.deleteNonconformity(item.id)
                .then(function () {
                    webix.message("Kirje kustutatud");
                    reloadNonconformityTable();
                })
                .catch(function (err) {
                    webix.message({ type: "error", text: "Kustutamine ebaõnnestus" });
                    console.error(err);
                });
        });
    }

    function editNonconformity(item) {
        $$("nonconformityForm").setValues(item);
        const list = $$("fileList");
        list.clearAll();
        list.parse(mapFilesToListItems(item.files || []));
    }

    const form = Components.createNonconformityForm(
        saveNonconformity,
        clearFormAndFiles
    );

    const attachmentPanel = Components.createAttachmentPanel();

    const tablePanel = Components.createNonconformityTable(
        editNonconformity,
        deleteNonconformityWithConfirm,
        updateQuantityInline
    );

    webix.ui({
        id: "rootLayout",
        rows: [
            {
                view: "toolbar",
                padding: { left: 10, right: 10 },
                elements: [
                    { view: "label", label: "MetaPrint" },
                    {},
                    {
                        view: "button",
                        label: "Testülesanne",
                        width: 150,
                        css: "btn btn-green",
                        click: function () {
                            const modal = $$("nonconformityModal");
                            if (modal) {
                                modal.show();
                                reloadNonconformityTable();
                            }
                        }
                    }
                ]
            },
            {
                template: "Vajuta nupule \"Testülesanne\", et avada mittevastavuste haldusaken.",
                css: "mp-placeholder"
            }
        ]
    });

    webix.ui({
        view: "window",
        id: "nonconformityModal",
        modal: true,
        fullscreen: true,
        move: false,
        position: "center",

        head: {
            view: "toolbar",
            css: "app-header",
            height: 40,
            padding: { left: 10, right: 10 },
            elements: [
                {
                    view: "label",
                    label: "Lisa mittevastavuse kommentaar - developer",
                    css: "app-header-title"
                },
                {},
                {
                    view: "button",
                    width: 30,
                    css: "mp-close-btn",
                    label: "✕",
                    click: function () {
                        $$("nonconformityModal").hide();
                    }
                }
            ]
        },

        body: {
            rows: [
                form,
                {
                    view: "accordion",
                    multi: true,
                    gravity: 1,
                    rows: [
                        attachmentPanel,
                        tablePanel
                    ]
                }
            ]
        }
    });

    webix.extend($$("nonconformityModal"), webix.ProgressBar);

    // reloadNonconformityTable();
});