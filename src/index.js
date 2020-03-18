function loadArticles() {
    setTimeout(function(){
        // logic here
        let url="/getArticles";
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
            if (this.status === 200) {
                //alert(this.response);
                treatData(this.response);
            }
            else {
                let error = new Error(this.statusText);
                error.code = this.status;
                alert(error);
            }
        };
        xhr.onerror = function() {
            alert("Network Error");
        };
        xhr.send();
        // recurse
        loadArticles();
    }, 1000);
}

function treatData(data) {
    dataObj = JSON.parse(data);
    let elem = document.getElementById("articles");
    let inner = '';
    for (let article of dataObj){
        inner += '<div class="blog-post border-bottom">' +
            '<h2 class="blog-post-title">'+ article.title +'</h2>' +
            '<p>'+ article.body +'</p>' +
            '</div>';
    }
    elem.innerHTML = inner;
}