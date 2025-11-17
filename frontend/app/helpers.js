function formatDateISO(isoString) {
    if (!isoString) return "";

    const dt = new Date(isoString);

    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yy = String(dt.getFullYear()).slice(-2);

    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    const ss = String(dt.getSeconds()).padStart(2, "0");

    return `${dd}.${mm}.${yy} ${hh}:${mi}:${ss}`;
}
