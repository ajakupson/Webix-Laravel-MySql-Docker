(function () {
    const { NONCONFORMITY_TYPE_OPTIONS, UNIT_OPTIONS  } = window.MetaPrintConstants;

    function resolveUnitLabel(unit) {
        const item = UNIT_OPTIONS.find(u => u.id === unit);
        return item ? item.value : unit;
    }

    function mapFilesToListItems(files) {
        return (files || []).map(f => ({
            id: f.id,
            name: f.original_name,
            url: f.url,
            status: "server"
        }));
    }

    function resolveTypeLabel(typeCode) {
        const item = NONCONFORMITY_TYPE_OPTIONS.find(t => t.id === typeCode);
        return item ? item.value : "";
    }

    function createNonconformityTable(onEdit, onDelete, onInlineQuantityUpdate) {
        return {
            view: "accordionitem",
            header: "<div class='accordion-header'>Mittevastavuste nimekiri</div>",
            body: {
                view: "datatable",
                id: "nonconformityTable",
                select: "row",
                editable: true,
                editaction: "dblclick",
                borderless: false,
                css: "webix_header_border webix_data_border nonconformity-table",

                autowidth: false,
                autoheight: false,
                scrollX: false,
                scrollY: "auto",
                resizeColumn: true,

                columns: [
                    { id: "id", header: "ID", width: 70, sort: "int" },
                    {
                        id: "type_code",
                        header: "Tüüpikirjeldus",
                        width: 160,
                        template: obj => resolveTypeLabel(obj.type_code)
                    },
                    { id: "comment", header: "Kirjeldus", fillspace: true },
                    { id: "quantity", header: "Kogus", width: 80, editor: "text" },
                    { id: "unit", header: "Ühik", width: 70, template: obj => resolveUnitLabel(obj.unit) },
                    { id: "created_by", header: "Kasutaja", width: 120 },
                    { id: "created_at", header: "Kuupäev", width: 150, template: obj => formatDateISO(obj.created_at) },
                    {
                        id: "actions",
                        header: "Tegevused",
                        width: 80,
                        template:
                            "<span class='webix_icon wxi-pencil btn-edit'></span> " +
                            "<span class='webix_icon wxi-trash btn-delete'></span>"
                    }
                ],

                onClick: {
                    "btn-delete": function (e, rowId) {
                        const item = this.getItem(rowId);
                        onDelete(item);
                        return false;
                    },
                    "btn-edit": function (e, rowId) {
                        const item = this.getItem(rowId);
                        onEdit(item);
                        return false;
                    }
                },

                on: {
                    onAfterEditStop: function (state, editor) {
                        if (editor.column === "quantity" && state.value !== state.old) {
                            const row = this.getItem(editor.row);
                            const num = parseInt(row.quantity, 10);

                            if (isNaN(num) || num <= 0) {
                                webix.message({ type: "error", text: "Kogus peab olema positiivne number" });
                                row.quantity = state.old;
                                this.updateItem(editor.row, row);
                                return;
                            }

                            onInlineQuantityUpdate(row.id, num);
                        }
                    },
                    onAfterSelect: function (rowId) {
                        const item = this.getItem(rowId);
                        const files = item.files || [];
                        const list = $$("fileList");
                        list.clearAll();
                        list.parse(mapFilesToListItems(files));
                    }
                }
            }
        };
    }

    window.MetaPrintComponents = window.MetaPrintComponents || {};
    window.MetaPrintComponents.createNonconformityTable = createNonconformityTable;
})();