var Datepicker = (function() {
	// Variables
	var $datepicker = $('.datepicker');
	// Methods
    function init($this) 
    {
		var options = {
			disableTouchKeyboard: true,
			autoclose: true
		};
		$this.datepicker(options);
	}
	// Events
    if ($datepicker.length) 
    {
		$datepicker.each(function(){
			init($(this));
		});
	}

})();