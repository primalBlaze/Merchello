﻿(function (controllers, undefined) {

    /**
     * @ngdoc controller
     * @name Merchello.Editors.Product.EditController
     * @function
     * 
     * @description
     * The controller for the product editor
     */
    controllers.ProductEditController = function ($scope, $routeParams, $location, notificationsService, dialogService, angularHelper, serverValidationManager, merchelloProductService, merchelloProductVariantService) {

        $scope.currentTab = "Variants";

        $scope.sortProperty = "sku";
        $scope.sortOrder = "asc";
        $scope.allVariants = false;
        $scope.bulkAction = false,
        $scope.selectedVariants = [];

        $scope.flyouts = {
            reorderVariants: false,
            changePrices: false,
            updateInventory: false,
            deleteVariants: false,
            duplicateVariants: false
        };

        if ($routeParams.create) {

            // TODO: this should redirect to product variant edit
            $scope.loaded = true;
            $scope.preValuesLoaded = true;
            $scope.product = new merchello.Models.Product();
            $(".content-column-body").css('background-image', 'none');
        }
        else {

            //we are editing so get the product from the server
            var promise = merchelloProductService.getByKey($routeParams.id);

            promise.then(function (product) {

                $scope.product = new merchello.Models.Product(product);

                $scope.loaded = true;
                $scope.preValuesLoaded = true;
                $(".content-column-body").css('background-image', 'none');

            }, function (reason) {

                notificationsService.error("Product Load Failed", reason.message);

            });
        }

        $scope.save = function () {

            notificationsService.info("Saving...", "");

            //we are editing so get the product from the server
            var promise = merchelloProductService.save($scope.product);

            promise.then(function (product) {

                notificationsService.success("Product Saved", "H5YR!");

            }, function (reason) {

                notificationsService.error("Product Save Failed", reason.message);

            });
        };

        $scope.chooseMedia = function () {

            dialogService.mediaPicker({
                multipicker: true,
                callback: function (data) {
                    _.each(data.selection, function (media, i) {
                        //shortcuts
                        //TODO, do something better then this for searching

                        var img = {};
                        img.id = media.id;
                        img.src = imageHelper.getImagePropertyValue({ imageModel: media });
                        img.thumbnail = imageHelper.getThumbnailFromPath(img.src);
                        $scope.images.push(img);
                        $scope.ids.push(img.id);
                    });

                    $scope.sync();
                }
            });

        };


        $scope.changeSortOrder = function (propertyToSort) {

            if ($scope.sortProperty == propertyToSort) {
                if ($scope.sortOrder == "asc") {
                    $scope.sortProperty = "-" + propertyToSort;
                    $scope.sortOrder = "desc";
                }
                else {
                    $scope.sortProperty = propertyToSort;
                    $scope.sortOrder = "asc";
                }
            }
            else {
                $scope.sortProperty = propertyToSort;
                $scope.sortOrder = "asc";
            }

        }

        $scope.selectedVariants = function () {
            return _.filter($scope.product.productVariants, function (v) {
                return v.selected;
            });
        }

        $scope.checkBulkVariantsSelected = function() {
            var v = $scope.selectedVariants();
            if (v.length > 1) {
                $scope.allVariants = true;
            }
            else {
                $scope.allVariants = false;
            }
        }

        $scope.toggleAVariant = function(variant) {
            variant.selected = !variant.selected;
            $scope.checkBulkVariantsSelected();
        }

        $scope.toggleAllVariants = function () {
            
        }

        $scope.selectVariants = function (attributeToSelect) {

            for (var i = 0; i < $scope.product.productVariants.length; i++) {
                $scope.product.productVariants[i].selected = false;
            }

            var filteredVariants = [];

            if (attributeToSelect == "All")
            {
                filteredVariants = $scope.product.productVariants;
            }
            else if (attributeToSelect == "None") {
            }
            else {
                var filteredVariants = _.filter($scope.product.productVariants,
                    function (variant) {
                        return _.where(variant.attributes, { name: attributeToSelect }).length > 0;
                    });
            }

            for (var v = 0; v < filteredVariants.length; v++)
            {
                filteredVariants[v].selected = true;
            }

            $scope.checkBulkVariantsSelected();
        }

        $scope.changePricesFlyout = new merchello.Models.Flyout(
            $scope.flyouts.changePrices,
            function (isOpen) {
                $scope.flyouts.changePrices = isOpen;
                $scope.reorderVariants = false;
                $scope.bulkAction = false;
            }, {
                confirm: function () {
                    notificationsService.success("Confirmed prices update", $scope.changePricesFlyout.newPrice);
                }
            });

        $scope.updateInventoryFlyout = new merchello.Models.Flyout(
            $scope.flyouts.updateInventory,
            function (isOpen) {
                $scope.flyouts.updateInventory = isOpen;
                $scope.reorderVariants = false;
                $scope.bulkAction = false;
            }, {
                confirm: function () {
                    notificationsService.success("Confirmed inventory update", $scope.updateInventoryFlyout.newInventory);
                }
            });

        $scope.deleteVariantsFlyout = new merchello.Models.Flyout(
            $scope.flyouts.deleteVariants,
            function (isOpen) {
                $scope.flyouts.deleteVariants = isOpen;
                $scope.reorderVariants = false;
                $scope.bulkAction = false;
            }, {
                confirm: function () {
                    notificationsService.success("Confirmed variants deleted");
                }
            });

        $scope.duplicateVariantsFlyout = new merchello.Models.Flyout(
            $scope.flyouts.duplicateVariants,
            function (isOpen) {
                $scope.flyouts.duplicateVariants = isOpen;
                $scope.reorderVariants = false;
                $scope.bulkAction = false;
            }, {
                confirm: function () {
                    notificationsService.success("Confirmed variants duplicated");
                }
            });


        $scope.selectTab = function (tabname) {
            $scope.currentTab = tabname;
        }

        $scope.addOption = function () {
            $scope.product.addBlankOption();
        };
        
        $scope.updateVariants = function (thisForm) {
        }

    }

    angular.module("umbraco").controller("Merchello.Editors.Product.EditController", merchello.Controllers.ProductEditController);

}(window.merchello.Controllers = window.merchello.Controllers || {}));

