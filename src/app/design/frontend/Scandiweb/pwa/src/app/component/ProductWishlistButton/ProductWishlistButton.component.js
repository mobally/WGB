import SourceProductWishlistButton from 'SourceComponent/ProductWishlistButton/ProductWishlistButton.component';
import './ProductWishlistButton.override.style.scss';

export default class ProductWishlistButton extends SourceProductWishlistButton {
    renderButton() {
        const { isInWishlist, isDisabled, mix } = this.props;

        return (
            <button
                block="ProductWishlistButton"
                mods={{ isInWishlist, isDisabled }}
                mix={{
                    block: 'Button',
                    mods: { isHollow: !isInWishlist },
                    mix
                }}
                title={this.getTitle()}
                onClick={this.onClick}
            >
                <svg
                    height="47px"
                    viewBox="-58 0 404 404.54235"
                    width="36px"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="m277.527344 0h-267.257813c-5.519531 0-10 4.476562-10 10v374.527344c-.007812 7.503906 4.183594 14.378906 10.855469 17.808594 6.675781 3.425781 14.707031 2.828124 20.796875-1.550782l111.976563-80.269531 111.980468 80.265625c6.09375 4.371094 14.117188 4.964844 20.789063 1.539062 6.667969-3.425781 10.863281-10.296874 10.863281-17.792968v-374.527344c0-5.523438-4.480469-10-10.003906-10zm-10 384.523438-117.796875-84.441407c-3.484375-2.496093-8.171875-2.496093-11.652344 0l-117.800781 84.445313v-364.527344h247.25zm0 0" />
                </svg>
            </button>
        );
    }
}
