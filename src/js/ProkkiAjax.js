/** @preserve Prokki Ajax 0.0.2
 * Available under the MIT license.
 * See https://github.com/prokki/prokki-ajax/ for more information.
 */

/**
 *
 * @param {object} options  - initial options
 *
 * @property {object}   _options               - properties of SelectableTable
 * @property {string}   _options.overlay       - all elements which can be selected
 * @property {boolean}  _options.overlayAuto   - all elements which can be selected
 * @property {string}   _options.spinner       - the class of each selected element (non selected class must not have this class)
 * @property {function} _options.beforeSend    - function (jqXHR, textStatus) see jQuery....!
 *
 * @property {jqXHR} _xhr
 *
 * @constructor
 */
let ProkkiAjax = function(options)
{
	this._options = {};
	this.$_overlay = null;
	this._startTime = new Date();
	this._xhr = null;

	this._initializeOptions = function(options)
	{
		this._options = $.extend({}, ProkkiAjax.DEFAULTS, options || {});
	};

	this._createOverlay = function()
	{
		let selector_parts = this._options.overlay.split(" ");

		let last_selector = selector_parts[selector_parts.length - 1];

		let tag = "div";
		let id = "";
		let classes = "";

		if( last_selector.search(/^[^#\.]+/g) > -1 )
		{
			tag = last_selector.match(/^[^#\.]+/g);
		}

		let $overlay = $(document.createElement(tag));

		if( last_selector.search(/#[^#\.\s]+/g) > -1 )
		{
			let ids = last_selector.match(/#[^#\.\s]+/g).map(function(_id)
			{
				return _id.substring(1);
			});

			if( ids.length > 1 )
			{
				throw new Error("Multiple ids in option overlay: " + this._options.overlay);
			}

			$overlay.attr("id", ids[0]);
		}

		if( last_selector.search(/\.[^#\.\s]+/g) > -1 )
		{
			classes = last_selector.match(/\.[^#\.\s]+/g).map(function(_id)
			{
				return _id.substring(1);
			});

			$overlay.attr("class", classes.join(" "));
		}

		$overlay.css("display", "none");

		$overlay.append($(document.createElement('div')).append(this._options.spinner));

		return $overlay;
	};

	this._appendOverlay = function()
	{
		let selector_parts = this._options.overlay.split(" ");
		selector_parts.pop();

		let selector = selector_parts.join(" ");

		if( selector === "" )
		{
			selector = "body";
		}

		let $append_to = $(selector);

		if( $append_to.length < 1 )
		{
			throw new Error("No element found to append overlay: " + this._options.overlay);
		}

		this.$_overlay.appendTo($append_to);
	};

	this._initializeOverlay = function()
	{
		// $ Selctor mit der ID füllen
		this.$_overlay = $(this._options.overlay);

		// globales Overlay initalisiern (falls es verwendet werden soll und noch nicht existiert)
		if( this.$_overlay.length === 0 )
		{
			if( !this._options.overlayAuto && window.console && console.warn )
			{
				console.warn("Overlay '" + this._options.overlay + "' for ajax call could not be found!");
			}
			else
			{
				this.$_overlay = this._createOverlay();

				this._appendOverlay(this.$_overlay);
			}
		}
	};


	this._showOverlay = function(jqXHR, options, fn)
	{
		this.$_overlay.css("display", "block").delay(250);

		// call original function
		if( fn !== undefined && fn !== null )
		{
			fn(jqXHR, options);
		}
	};

	this._getAjaxOptions = function()
	{
		let ajax_options = $.extend({}, this._options);

		for( let _key in ProkkiAjax.DEFAULTS )
		{
			if( ajax_options.hasOwnProperty(_key) )
			{
				delete ajax_options[_key];
			}
		}

		let remove_function_from_ajax_options = function(name)
		{
			if( !ajax_options.hasOwnProperty(name) || this._options[name] === undefined )
			{
				return null;
			}

			if( typeof this._options[name] !== "function" && window.console && console.warn )
			{
				console.warn("Option " + name + " must be a function, got " + (typeof this._options[name]));

				return null;
			}

			delete ajax_options[name];

			return this._options[name].bind({}); // .clone()

		}.bind(this);

		let fnBeforeSend = remove_function_from_ajax_options("beforeSend");

		ajax_options.beforeSend = function(jqXHR, options)
		{
			this._showOverlay(jqXHR, options, fnBeforeSend)
		}.bind(this);

		return ajax_options;
	};

	this._initializeOptions(options);

	this._initializeOverlay();

	return this;
};


ProkkiAjax.prototype.ajax = function()
{
	this._xhr = $.ajax(this._getAjaxOptions());
	return this._xhr;
};

ProkkiAjax.prototype.hideOverlay = function()
{
	if( this._options.minDuration !== false )
	{
		let mseconds = (new Date()) - this._startTime;

		if( mseconds < this._options.minDuration )
		{
			setTimeout(function()
			{
				this.hideOverlay();
			}.bind(this), this._options.minDuration - mseconds);

			return;
		}
	}

	this.$_overlay.css("display", "none");
};

/**
 *
 * @type {object}
 */
ProkkiAjax.DEFAULTS = {
	overlay: "#ajax-loading",
	overlayAuto: true,
	spinner: "<i class=\"fa fa-spinner fa-spin fa-3x fa-fw\"></i><span class=\"sr-only\">Refreshing...</span>",
	minDuration: 500,
	beforeSend: null
};