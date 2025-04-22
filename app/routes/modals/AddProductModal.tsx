// import { Checkbox, Modal, Spinner, Text } from "@shopify/polaris";
// import { useState, useCallback, useEffect } from "react";
// import { useProducts } from '../../lib/helper/queries';

// interface IProps {
//   isAddProductModalOpen: boolean;
//   setIsAddProductModalOpen: (isAddProductModalOpen: boolean) => void;
//   onProductsChange?: (products: Array<{ id: string; name: string; min: string; max: string }>) => void;
// }

// export const AddProductModal: React.FC<IProps> = ({
//   isAddProductModalOpen,
//   setIsAddProductModalOpen,
//   onProductsChange
// }) => {
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const { data: products = [], isLoading } = useProducts();

//   useEffect(() => {
//     if (isAddProductModalOpen) {
//       const savedSelectedProducts = localStorage.getItem('selectedProducts');
//       if (savedSelectedProducts) {
//         try {
//           setSelectedProducts(JSON.parse(savedSelectedProducts));
//         } catch (error) {
//           console.error("Error parsing saved products:", error);
//           setSelectedProducts([]);
//         }
//       }
//     }
//   }, [isAddProductModalOpen]);

//   const handleCloseAddProductModal = useCallback(() => {
//     setIsAddProductModalOpen(false);
//     localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
//   }, [setIsAddProductModalOpen, selectedProducts]);

//   const handleProductSelection = useCallback((productId: string) => {
//     setSelectedProducts(prevSelected => {
//       const newSelected = prevSelected.includes(productId)
//         ? prevSelected.filter(id => id !== productId)
//         : [...prevSelected, productId];

//       localStorage.setItem('selectedProducts', JSON.stringify(newSelected));
//       return newSelected;
//     });
//   }, []);

//   const handleAddSelectedProducts = useCallback(() => {
//     const productsToAdd = products
//       .filter(product => selectedProducts.includes(product.id))
//       .map(product => ({
//         id: product.id,
//         name: product.title,
//         min: "10",
//         max: "20",
//       }));

//     const savedLimitations = localStorage.getItem('productLimitations');
//     let existingLimitations = [];

//     if (savedLimitations) {
//       try {
//         existingLimitations = JSON.parse(savedLimitations);
//       } catch (error) {
//         console.error("Error parsing saved limitations:", error);
//       }
//     }

//     const newLimitations = [...existingLimitations];

//     productsToAdd.forEach(product => {
//       if (!newLimitations.some(item => item.id === product.id)) {
//         newLimitations.push(product);
//       }
//     });

//     localStorage.setItem('productLimitations', JSON.stringify(newLimitations));

//     if (onProductsChange) {
//       onProductsChange(newLimitations);
//     }

//     handleCloseAddProductModal();
//   }, [products, selectedProducts, handleCloseAddProductModal, onProductsChange]);

//   return (
//     <Modal
//       open={isAddProductModalOpen}
//       onClose={handleCloseAddProductModal}
//       title="Select Products"
//       primaryAction={{
//         content: "Add Selected Products",
//         onAction: handleAddSelectedProducts,
//         disabled: selectedProducts.length === 0,
//       }}
//       secondaryActions={[
//         {
//           content: "Cancel",
//           onAction: handleCloseAddProductModal,
//         },
//       ]}
//     >
//       <Modal.Section>
//         {isLoading ? (
//           <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
//             <Spinner accessibilityLabel="Loading products" size="large" />
//           </div>
//         ) : (
//           <div>
//             {products.length === 0 ? (
//               <Text as="span" variant="bodyMd">No products found</Text>
//             ) : (
//               products.map((product) => (
//                 <div key={product.id} style={{ padding: "8px 0" }}>
//                   <Checkbox
//                     label={product.title}
//                     checked={selectedProducts.includes(product.id)}
//                     onChange={() => handleProductSelection(product.id)}
//                   />
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </Modal.Section>
//     </Modal>
//   );
// };

// export default AddProductModal;
