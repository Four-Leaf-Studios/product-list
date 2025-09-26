
import type { Product } from "@/types";
import { useWishlist } from "@/hooks/useWishlist";
import { createContext } from "preact";
import { useContext } from "preact/hooks";

type WishlistContextValue = {
  wishlist: Product[];
  addToWishlist: (p: Product) => Promise<void>;
  removeFromWishlist: (p: Product) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

export const WishlistProvider = ({
  children,
}: {
  children: preact.ComponentChildren;
}) => {
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist: (p: Product) => addToWishlist({ item: p }),
        removeFromWishlist: (p: Product) => removeFromWishlist({ item: p }),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlistContext must be used inside WishlistProvider");
  }
  return ctx;
};
