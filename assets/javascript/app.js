//$('#textarea1').val('New Text');
//M.textareaAutoResize($('#textarea1'));
//import(MDCTextField); from('@material/textfield');

//const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})