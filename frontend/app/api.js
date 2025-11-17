const API_BASE_URL = "http://localhost:8000/api/nonconformity";

let activeRequests = 0;

function withProgress(promise) {
    const modal = $$ && $$("nonconformityModal");

    if (modal && modal.showProgress && modal.hideProgress) {
        if (activeRequests === 0) {
            modal.showProgress({ type: "icon" });
        }
        activeRequests++;

        return promise.finally(() => {
            activeRequests--;
            if (activeRequests <= 0) {
                modal.hideProgress();
                activeRequests = 0;
            }
        });
    }

    return promise;
}

window.MetaPrintApi = {
    getNonconformities() {
        return withProgress(
            webix.ajax()
                .get(API_BASE_URL)
                .then(res => res.json())
        );
    },

    createNonconformity(data) {
        const json = JSON.stringify(data);

        return withProgress(
            webix.ajax().headers({
                "Content-Type": "application/json",
                "Accept": "application/json"
            }).post(API_BASE_URL, json).then(res => res.json())
        );
    },

    updateNonconformity(id, data) {
        const json = JSON.stringify(data);

        return withProgress(
            webix.ajax().headers({
                "Content-Type": "application/json",
                "Accept": "application/json"
            }).put(`${API_BASE_URL}/${id}`, json).then(res => res.json())
        );
    },

    deleteNonconformity(id) {
        return withProgress(
            webix.ajax().headers({
                "Accept": "application/json"
            }).del(`${API_BASE_URL}/${id}`)
        );
    },

    uploadFiles(nonconformityId, uploader) {
        uploader.config.upload = `${API_BASE_URL}/${nonconformityId}/files`;

        return withProgress(
            new Promise((resolve) => {
                uploader.send(() => resolve());
            })
        );
    }
};