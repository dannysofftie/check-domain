((window, document) => {
    let df = document.querySelector('form')
    df.addEventListener('submit', function (e) {
        e.preventDefault()
        let jsonobject = Object.assign(...Array.from(new FormData(this), ([x, y]) => ({
            [x]: y
        })))

        fetch('/resolve', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonobject)
            })
            .then(res => res.json())
            .then(data => {
                document.getElementById('json_response').innerHTML = data
                console.log(data)
            })
    })

    document.getElementById('json_response_link').addEventListener('click', (e) => {
        e.preventDefault()
        document.getElementById('json_response').style.width = "100%"
    })
})(window, document)