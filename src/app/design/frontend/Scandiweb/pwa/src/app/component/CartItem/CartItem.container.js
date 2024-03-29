import { connect } from 'react-redux';

import Event, {
    EVENT_GTM_PRODUCT_ADD_TO_CART, EVENT_GTM_PRODUCT_REMOVE_FROM_CART
} from 'Util/Event';
import {
    CartItemContainer as SourceCartItemContainer,
    mapDispatchToProps
} from 'SourceComponent/CartItem/CartItem.container';
import CartItem from './CartItem.component';

export { mapDispatchToProps };

export class CartItemContainer extends SourceCartItemContainer {
    /**
     * Handle item quantity change. Check that value is <1
     * @param {Number} value new quantity
     * @return {void}
     */
    handleChangeQuantity(quantity) {
        const { item, item: { qty } } = this.props;

        this.setState({ isLoading: true }, () => {
            const { changeItemQty, item: { item_id, sku } } = this.props;
            this.hideLoaderAfterPromise(
                changeItemQty({ item_id, quantity, sku })
                    .then(() => {
                        if (qty < quantity) {
                            Event.dispatch(EVENT_GTM_PRODUCT_ADD_TO_CART, {
                                product: item,
                                quantity: quantity - qty,
                                isItem: true
                            });
                        } else {
                            Event.dispatch(EVENT_GTM_PRODUCT_REMOVE_FROM_CART, {
                                item,
                                quantity: qty - quantity
                            });
                        }
                    })
            );
        });
    }

    /**
     * @return {void}
     */
    handleRemoveItem() {
        this.setState({ isLoading: true }, () => {
            const { removeProduct, item } = this.props;
            const { item_id, qty: quantity } = item;

            this.hideLoaderAfterPromise(
                removeProduct(item_id)
                    .then(() => {
                        Event.dispatch(EVENT_GTM_PRODUCT_REMOVE_FROM_CART, {
                            item,
                            quantity
                        });
                    })
            );
        });
    }

    render() {
        return (
            <CartItem
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
              { ...this.containerProps() }
            />
        );
    }
}

export default connect(null, mapDispatchToProps)(CartItemContainer);
