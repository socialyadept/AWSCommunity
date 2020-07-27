$('document').ready(function () {

    $('form').on('submit', function (event) {
        // console.log('clicked');
        // event.stopPropagation();
        // event.preventDefault();

        // $.ajax({
        //     url: '/newsletter',
        //     type: 'POST',
        //     data: $('#newsletter').serialize(),
        //     dataType: 'text'
        //     // success: function (data) {
        //     //     alert('success');
        //     //     console.log(data);
        //     //     // $('#subscribe-btn').css('display', 'none');
        //     //     // $('form p').css('display', 'block');
        //     //     // $('form').css('display', 'none');
        //     //     // $('.circle-loader').css('display', 'flex');
        //     //     // window.setTimeout(function () {
        //     //     //     $('.circle-loader').toggleClass('load-complete');
        //     //     //     $('.checkmark').toggle();
        //     //     //     $('#success').css('display', 'inline')
        //     //     // }, 1200);
        //     //     // success.style.display = 'inline';
        //     // },
        //     // error: function () {
        //     //     console.log('inside err');
        //     // },
        //     // complete: function (response, textStatus) {
        //     //     return console.log("Hey: " + textStatus);
        //     // }
        // }).done(function (data) {
        //     console.log('data');
        // }).fail(function (data) {
        //     console.log('indside fail');
        // });

        console.log('clicked');

        ChangePurpose('adad', 'adaaa', Callback);
    });

    // function newsletter() {

    // };

    function ChangePurpose(Vid, PurId, callbackfn) {
        var Success = false;
        $.ajax({
            type: "post",
            url: "/newsletter",
            dataType: "text",
            data: $('#newsletter').serialize(),
            success: function (data) {
                callbackfn(data)
            },
            error: function (textStatus, errorThrown) {
                callbackfn("Error getting the data")
            }
        });
    }

    function Callback(data) {
        alert(data);
    }
});