
var tgui_ldap = {
  formSelector: '',
  init: function() {
    var self = this;
    return Promise.resolve(this.fulfill());
  },
  fulfill: function() {
    var self = this;
    var ajaxProps = {
      url: API_LINK+"mavis/ldap/",
      type: "GET"
    };//ajaxProps END

    return new Promise(
      function (resolve, reject) {
        ajaxRequest.send(ajaxProps).then(function(resp) {
          tgui_supplier.fulfillForm(resp.LDAP_Params, '');
          (resp.LDAP_Params.enabled) ? $('div.disabled_shield').hide() : $('div.disabled_shield').show()
          resolve(true);
        }).fail(function(err){
          tgui_error.getStatus(err, ajaxProps)
        })
      }
    );
  },
  save: function() {
    console.log('Edit LDAP Settings');
    var self = this;
    var formData = tgui_supplier.getFormData(self.formSelector, true);

    var ajaxProps = {
      url: API_LINK+"mavis/ldap/",
      type: 'POST',
      data: formData
    };//ajaxProps END

    if ( ! tgui_supplier.checkChanges(ajaxProps.data, ['id']) ) return false;
    
    ajaxRequest.send(ajaxProps).then(function(resp) {
      if (tgui_supplier.checkResponse(resp.error, self.formSelector)){
        return;
      }
      tgui_error.local.show({type:'success', message: "LDAP settings was saved"})
      tgui_status.changeStatus(resp.changeConfiguration)
      self.fulfill();
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
    return this;
  },
  tester: function() {
    $('pre.check_result').empty();
    $('pre.check_result').append( tgui_supplier.loadElement() );

    var self = this;
    var formData = {};
        formData.test_username = $('[name="test_username"]').val();
        formData.test_password = $('[name="test_password"]').val();

    var ajaxProps = {
      url: API_LINK+"mavis/ldap/check/",
      type: 'POST',
      data: formData
    };//ajaxProps END

    ajaxRequest.send(ajaxProps).then(function(resp) {
      $('pre.check_result').empty();
      if (tgui_supplier.checkResponse(resp.error, self.formSelector)){
        $('pre.check_result').append('Error');
        return;
      }
      $('pre.check_result').append(resp.check_result);
    }).fail(function(err){
      tgui_error.getStatus(err, ajaxProps)
    })
    return this;

  }
}
