﻿function BaseProxy(apiAddress, controllerName) {
    this.apiAddress = apiAddress != null && apiAddress != '' ? apiAddress : autoproxy.baseUrl;
    this.controllerName = controllerName;
}

BaseProxy.prototype = {
    constructor: BaseProxy,

    ResolveRequestUrl: function (actionName) {
        //Creates the url based on the api location, the controller and the action
        if (autoproxy.includeActionName) {
            return [this.apiAddress, this.controllerName, actionName].join("/");
        }
        else {
            return [this.apiAddress, this.controllerName].join("/");
        }
    },

    ExecuteRequest: function (webActionType, actionName, request, callback, context, carryover) {
        //Executes a server action request (JSON -> JSON)
        $.ajax(
        {
            url: this.ResolveRequestUrl(actionName),
            type: webActionType,
            dataType: autoproxy.dataType,
            contentType: autoproxy.contentType,
            data: (webActionType == 'POST' || webActionType == 'PUT') && request != null ? JSON.stringify(request) : request,
            context: context,
            success: function (response) {
                //Execute the callback function
                if (typeof callback === 'function') {
                    callback(response, carryover);
                }
            },
            failure: function () {
                //Execute the callback function
                if (typeof callback === 'function') {
                    //Create an error response
                    var response = {
                        Result: -1,
                        ResultMessage: 'Communication error!'
                    };
                    callback(response, carryover);
                }
            }
        });
    }
};