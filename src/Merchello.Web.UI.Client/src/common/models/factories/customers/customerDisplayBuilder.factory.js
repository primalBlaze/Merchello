    /**
     * @ngdoc service
     * @name customerDisplayBuilder
     *
     * @description
     * A utility service that builds CustomerDisplay models
     */
    angular.module('merchello.models').factory('customerDisplayBuilder',
        ['genericModelBuilder', 'customerAddressDisplayBuilder', 'extendedDataDisplayBuilder', 'invoiceDisplayBuilder', 'CustomerDisplay',
        function(genericModelBuilder, customerAddressDisplayBuilder, extendedDataDisplayBuilder,
                 invoiceDisplayBuilder, CustomerDisplay) {

            var Constructor = CustomerDisplay;
            return {
                createDefault: function() {
                    return new Constructor();
                },
                transform: function(jsonResult) {
                    var customers = [];
                    if(angular.isArray(jsonResult)) {
                        for(var i = 0; i < jsonResult.length; i++) {
                            var customer = genericModelBuilder.transform(jsonResult[ i ], Constructor);
                            customer.addresses = customerAddressDisplayBuilder.transform(jsonResult[ i ].addresses);
                            customer.invoices = invoiceDisplayBuilder.transform(jsonResult[ i ].invoices);
                            customer.extendedData = extendedDataDisplayBuilder.transform(jsonResult[ i ].extendedData);
                            customers.push(customer);
                        }
                    } else {
                        customers = genericModelBuilder.transform(jsonResult, Constructor);
                        customers.addresses = customerAddressDisplayBuilder.transform(jsonResult.addresses);
                        customers.invoices = invoiceDisplayBuilder.transform(jsonResult.invoices);
                        customers.extendedData = extendedDataDisplayBuilder.transform(jsonResult.extendedData);
                    }
                    return customers;
                }
            };

    }]);
