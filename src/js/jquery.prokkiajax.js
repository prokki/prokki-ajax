(function($)
	{
		if( $.prokkiajax == null )
		{
			$.prokkiajax = function(options)
			{
				return new ProkkiAjax(options);
			}
		}
	}(jQuery)
);