/*
 * Only Common Js goes here
 */
$(document).ready(function () {
    // Link Click post data
    $(document).on('click', '.link_post_data', function (e) {
        e.preventDefault();
        var url = $(this).data('url');
        var postData = $(this).data('post');
        var data = postData;
        var post = ajax_post(url, data);
        post.done(function (response) {
            holder = response.holder;
            notification_handler(response, holder);
        });
    });
    //Load results on pagination
    $(document).on('click', '.pagination li>a', function (e) {        
        e.preventDefault();
        var url = $(this).data('url');
        var postData = $(this).data('post');
        var data = postData;
        var post = ajax_post(url, data);
        post.done(function (response) {
            holder = response.holder;
            notification_handler(response, holder);
        });
    });
    // INITIALIZE Dropzone on a modal
    $('#crud_modal').on('show.bs.modal', function (e) {
        init_dropzone();
    })
    //Load and view data from a ajax post on page load
    $('.load-on-load-list span').each(function () {
        var url = $(this).data('url');
        var holder = $(this).data('holder');
        var postData = $(this).data('post');
        var data = postData;
        var post = ajax_post(url, data);
        post.done(function (response) {
            notification_handler(response, holder);
        });
    });
    // Select box plugin
//    $('.chosen').selectpicker();
    // Basic Text Form Submit
    $(document).on('click', '.text-form .text-form-submit', function (e) {
        e.preventDefault();
        var elem = $(this);
        var postData = elem.closest('form').serialize();
        var url = elem.data('url');
        var target = '';
        var spiner = '';
        if (elem.data('spinner') != undefined) {
            spiner = elem.data('spinner');
        }
        if (elem.data('target') != undefined) {
            target = elem.data('target');
        }
        var post = ajax_post(url, postData, spiner, elem);
        post.done(function (response) {
            notification_handler(response, target, spiner, elem);
        });
    });
//Save a form With image
    $(document).on('click', '.image-form .image-form-submit', function (e) {
        e.preventDefault();
        var elem = $(this);
        var url = elem.data('url');
        var target = '';
        var spiner = '';
        var formData = new FormData($(".image-form")[0]);
        $.ajax({
            dataType: 'json',
            url: url,
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                notification_handler(response, target, spiner, elem);
            }
        });
    });
});
// Submit a form in a modal
//$('.crud_modal_content').on('click', '.text-form .text-form-submit', function (e) {
//    e.preventDefault();
//    var elem = $(this);
//    var postData = elem.closest('form').serialize();
//    var url = elem.data('url');
//    var target = '';
//    var spiner = '';
//    if (elem.data('spinner') != undefined) {
//        spiner = elem.data('spinner');
//    }
//    if (elem.data('target') != undefined) {
//        target = elem.data('target');
//    }
//    var post = ajax_post(url, postData, spiner, elem);
//    post.done(function (response) {
//        notification_handler(response, target, spiner, elem);
//    });

// Unique feild validation while typing
$('.text-form .unique-feild').on('focusout', function () {
    spinner = 'inline';
    elem = $(this);
    var postData = {value: elem.val(), label: elem.attr('name')};
    var url = elem.data('url');
    var post = ajax_post(url, postData, spinner, elem);
    post.done(function (response) {
        notification_handler(response, '', spinner, elem);
    });
});
// drop down on change do something
$(document).on('change', '.chain-dropdown', function () {
    spinner = 'inline';
    elem = $(this);
    var url = elem.data('url');
    var target = elem.data('target');
    var postData = elem.data('postdata');
    postData['selected_id'] = elem.val();
    var post = ajax_post(url, postData, spinner, elem);
    post.done(function (response) {
        notification_handler(response, target, spinner, elem);
    });
});
// Chain drop downs primary forms
$(document).on('change', '.parent-chain', function () {
    var url = $(this).data('url');
    var holder = $(this).data('target-chain-holder');
    var postData = $(this).val();
    var data = {'selected_options[]': postData};
    var post = ajax_post(url, data);
    post.done(function (response) {
        $(holder).html(response.data);
//        $(holder).selectpicker('refresh');
    });
})
//});
// Date time picker Date Range INIT and clone another set of range selectors
function date_range_picker_init() {
    $('.trigger-date-ranges').on('mousedown', '.input-increment-list div.input-elements:last input', function () {
        var clone_element = $('.input-increment-list div.input-elements:last');
        clone_element.clone().appendTo('.input-increment-list');
        init_picker();
    });
    init_picker();
}
// init daterange picker on two fields
function init_picker() {
    $('.date_picker').datetimepicker({
        format: 'YYYY-MM-DD',
    });
//    $('.end_date_range').datetimepicker({
//        format: 'YYYY-MM-DD',
////        useCurrent: false //Important! See issue #1075
//    });
}
// On crud modal open for edit load chain drop downs 
function on_crud_modal_edit_load_chain_drop_downs(elem, postData, spinner) {
    var url = elem.data('url');
    var target = elem.data('target');
    var postData = elem.data('postdata');
    postData['selected_id'] = elem.val();
    var post = ajax_post(url, postData, spinner, elem);
    post.done(function (response) {
        notification_handler(response, target, spinner, elem);
    });
}

// Clone input fields on focus on last form field
function clone_input_field() {

//    console.log($('.input-increment-list div.input-elements:last').children().children().attr('class'));
    $('.trigger').on('keydown', '.input-increment-list div.input-elements:last', function () {
        var clone_element = $('.input-increment-list div.input-elements:last');
        clone_element.clone().appendTo('.input-increment-list');
    });
}

// Start with all ajax calls
$(document).ajaxStart(function () {
});
function ajax_post(url, postData, loader, elem) {
    var loader = loader === undefined ? false : loader;
    var elem = elem === undefined ? false : elem;
    if (loader == 'inline') {
        show_spinner_next_to_elem(elem);
    }
    return $.ajax({
        type: "POST",
        dataType: 'json',
        url: url,
        data: postData,
        fail: function () {
            alert('there was an error');
        },
        beforeSend: function () {
        }
    });
}
function show_spinner_next_to_elem(elem) {
//    alert();
//    elem.closest().find('button-spin').css({display: 'block'});
//    console.log(elem.closest().find('.button-spin'));
    $('.button-spin').show();
}
function hide_spinner_next_to_elem(elem) {
    elem.closest().find('button-spin').css({display: 'none'});
}
function notification_handler(response, target, loader, elem) {
    var target = target === undefined ? false : target;
    var loader = loader === undefined ? false : loader;
    var elem = elem === undefined ? false : elem;
    if (loader == 'inline') {
        $('.button-spin').hide();
        //hide_spinner_next_to_elem(elem);
    }
    if (response.status == 'success') {
        if (response.renderType == 'message' || response.renderType == 'messagewithview' || response.renderType == 'messagewithmodal' || response.renderType == 'messagewithvalidation') {
            refresh_data_table(response.data);
            success_notification(response.message);
            redirect(response.redirect);
            $('#crud_modal').modal('hide');
        }
        if (response.renderType == 'view' || response.renderType == 'messagewithview') {
            render_view(response.data.view, response.data.holder);
//            $('.chosen').selectpicker();
        }
        if (response.renderType == 'modal' || response.renderType == 'messagewithmodal') {
            render_view(response.data.view, response.data.holder);
//            $('#crud_modal').modal('hide');
            $('#crud_modal').modal('show');
            // Drop Down
//            $('.chosen').selectpicker();
            // Clone input fields
//            clone_input_field();
            init_dropzone();
            // Date picker
            date_range_picker_init();
        }
        if (response.renderType == 'validation' || response.renderType == 'messagewithvalidation') {
            show_validation_errors(response.data);
        }
    } else {
        if (response.renderType == 'message' || response.renderType == 'messagewithvalidation') {
            error_notification(response.message);
            redirect(response.redirect);
        }
        if (response.renderType == 'validation' || response.renderType == 'messagewithvalidation') {
            show_validation_errors(response.data);
        }
    }
}

function success_notification(message) {
    $.gritter.add({
        title: "Success!",
        text: message,
        sticky: false,
        time: '5000',
        class_name: 'gritter-success'
    });
}
function error_notification(message) {
    $.gritter.add({
        title: "Error!",
        text: message,
        sticky: false,
        time: '5000',
        class_name: 'gritter-error'
    });
}

function render_view(view, target) {
//    $('.' + target).html('');
    $('.' + target).html(view);
}

function show_validation_errors(validationData) {
    $.each(validationData, function (index, value) {
        if (value != '') {
            $('.' + index).html(value);
            $('.' + index).removeClass('success-msg');
            $('.' + index).addClass('error-msg');
            $('.' + index).prev('.form-control').addClass('error-msg-border');
        } else {
            $('.' + index).html('');
            $('.' + index).addClass('success-msg');
            $('.' + index).removeClass('error-msg');
            $('.' + index).prev('.form-control').removeClass('error-msg-border');
        }
    });
}

function redirect(redirect) {
    if (redirect == 'self') {
        setTimeout(function () {
            location.reload(true);
        }, 2800);
    } else if (redirect != '') {
        setTimeout(function () {
            window.location.href = redirect;
        }, 1800);
    }
}

function refresh_data_table(response) {
    if (response.refresh_data == 'true') {
        var url = response.refresh_url;
        var holder = response.refresh_holder;
        var postData = [];
        var data = postData;
        var post = ajax_post(url, data);
        post.done(function (response) {
            notification_handler(response, holder);
        });
    } else {
        return true;
    }
}
/*
 * Only Common Js goes till here
 */
$('#add-new-item').on('click', function () {
    elem = $(this);
    var target = elem.data('target');
    spinner = '';
    var postData = {value: elem.val(), label: elem.attr('name')};
    var url = elem.data('url');
    var post = ajax_post(url, postData, spinner, elem);
    post.done(function (response) {
        notification_handler(response, target, spinner, elem);
    });
});
// Edit Delete actions
$('.table-data-holder').on('click', '.edit-delete-button', function (e) {
    e.preventDefault();
    var action_id = $(this).data('action_id');
    var postData = {action_id: action_id};
    var url = $(this).data('url');
    var target = '';
    if ($(this).data('target') != undefined) {
        target = $(this).data('target');
    }
    var post = ajax_post(url, postData);
    post.done(function (response) {
        notification_handler(response, target);
    });
});