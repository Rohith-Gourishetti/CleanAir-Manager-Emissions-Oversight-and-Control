function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
domReady(function () {
    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 }
    );
    function onScanSuccess(decodeText, decodeResult) {
        if (decodeText) {
            alert("Barcode Scanned: " + decodeText);
            htmlscanner.clear();
            var numberPattern = /^[-+]?\d*\.?\d+$/;
            if (!numberPattern.test(decodeText)) {
                alert("Scan only barcode");
                document.location.href="verify.html";
            }
            else {
                fetch('/fetch1/' + encodeURIComponent(decodeText))
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return res.json();
                    })
                    .then(data => {
                        if (data.success) {
                            const productName = data.name;
                            const liters = data.min + '-' + data.max + " " + data.unit;
                            const alertMessage = `Product name:${productName}\nBrand name:${data.brand}\nQuantity: ${liters}`;
                            alert(alertMessage);
                            document.location.href = "verify.html";
                        } else {
                            alert("Product not available in the database");
                            document.location.href = "verify.html";
                        }
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        alert("Failed to fetch product details. Please try again.");
                        document.location.href = "verify.html";
                    });
            }
        } else {
            window.location.reload();
        }
    }
    htmlscanner.render(onScanSuccess);
});