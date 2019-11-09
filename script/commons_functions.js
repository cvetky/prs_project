export function send_request(url, callback_on_success) {
    var that = this
    var json_result = {}
    const request = new Request(url)
    fetch(request).then(response => {
        if (response.status === 200) {
            response.json().then(data => {
                callback_on_success(data)
            })
        }
    })
    return json_result
}