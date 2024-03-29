/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { connect } from 'react-redux';
import { PureComponent } from 'react';
import { Subscribe } from 'unstated';

import SharedTransitionContainer from 'Component/SharedTransition/SharedTransition.unstated';
import { ProductType, FilterType } from 'Type/ProductList';
import { getVariantsIndexes } from 'Util/Product';
import { CartDispatcher } from 'Store/Cart';
import FavoriteItemCard from './FavoriteItemCard.component';

export const mapDispatchToProps = dispatch => ({
    addProduct: options => CartDispatcher.addProductToCart(dispatch, options)
});

const IMAGE_SWATCH = '1';
export class FavoriteItemCardContainer extends PureComponent {
    static propTypes = {
        product: ProductType,
        selectedFilters: FilterType
    };

    static defaultProps = {
        product: {},
        selectedFilters: {}
    };

    containerFunctions = {
        getAttribute: this.getAttribute.bind(this)
    };

    getAttribute(code) {
        const { selectedFilters } = this.props;

        if (!Object.keys(selectedFilters).length) {
            const { product: { attributes = {} } } = this.props;
            return attributes[code];
        }

        const currentVariantIndex = this._getCurrentVariantIndex();
        const { product, product: { variants = [] } } = this.props;
        const { attributes: parentAttributes = {} } = product;
        const { attributes = parentAttributes } = variants[currentVariantIndex] || product;
        const { attribute_options = {} } = parentAttributes[code] || {};

        return {
            ...attributes[code],
            attribute_options
        };
    }

    containerProps = () => ({
        availableVisualOptions: this._getAvailableVisualOptions(),
        currentVariantIndex: this._getCurrentVariantIndex(),
        productOrVariant: this._getProductOrVariant(),
        thumbnail: this._getThumbnail()
    });


    _getCurrentVariantIndex() {
        const { index } = this._getConfigurableParameters();
        return index >= 0 ? index : 0;
    }

    _getConfigurableParameters() {
        const { product: { variants = [] }, selectedFilters = {} } = this.props;
        const filterKeys = Object.keys(selectedFilters);

        if (filterKeys.length < 0) return { indexes: [], parameters: {} };

        const indexes = getVariantsIndexes(variants, selectedFilters);
        const [index] = indexes;

        if (!variants[index]) return { indexes: [], parameters: {} };
        const { attributes } = variants[index];

        const parameters = Object.entries(attributes)
            .reduce((parameters, [key, { attribute_value }]) => {
                if (filterKeys.includes(key)) return { ...parameters, [key]: attribute_value };
                return parameters;
            }, {});

        return { indexes, index, parameters };
    }

    _isThumbnailAvailable(path) {
        return path && path !== 'no_selection';
    }

    _getThumbnail() {
        const product = this._getProductOrVariant();
        const { small_image: { url } = {} } = product;
        if (this._isThumbnailAvailable(url)) return url;

        // If thumbnail is, missing we try to get image from parent
        const { product: { small_image: { url: parentUrl } = {} } } = this.props;
        if (this._isThumbnailAvailable(parentUrl)) return parentUrl;

        return '';
    }

    _getProductOrVariant() {
        const { product: { type_id, variants }, product } = this.props;
        return (type_id === 'configurable' && variants !== undefined
            ? variants[this._getCurrentVariantIndex()]
            : product
        ) || {};
    }

    _getAttributeOptions() {
        const { product: { attribute_options = [], attribute_values } } = this.props;

        return Object.values(attribute_options).reduce(
            (acc, option) => {
                const {
                    swatch_data,
                    label,
                    value: attrValue
                } = option;

                const { type, value } = swatch_data || {};

                if (
                    type === IMAGE_SWATCH
                    && attribute_values.includes(attrValue)
                ) {
                    acc.push({ value, label });
                }

                return acc;
            }, []
        );
    }

    _getAvailableVisualOptions() {
        const { product: { configurable_options = [] } } = this.props;

        return Object.values(configurable_options).reduce((acc) => {
            const visualOptions = this._getAttributeOptions();

            if (visualOptions.length > 0) return [...acc, ...visualOptions];
            return acc;
        }, []);
    }

    render() {
        return (
            <Subscribe to={ [SharedTransitionContainer] }>
                { ({ registerSharedElement }) => (
                    <FavoriteItemCard
                      { ...{ ...this.props, registerSharedElement } }
                      { ...this.containerFunctions }
                      { ...this.containerProps() }
                    />
                ) }
            </Subscribe>
        );
    }
}


export default connect(null, mapDispatchToProps)(FavoriteItemCardContainer);
