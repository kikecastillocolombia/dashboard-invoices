import { CreateProduct, UpdateProduct, DeleteProduct } from '@/app/ui/products/buttons';
import { fetchProducts } from '@/app/lib/data';

export default async function ProductsTable() {
  const products = await fetchProducts();

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Productos</h2>
            <CreateProduct />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products?.map((product) => (
              <div key={product.id} className="rounded-lg bg-white p-4 shadow-md">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">
                  {product.description || 'No description available.'}
                </p>
                <p className="text-sm font-semibold text-gray-800">${product.price}</p>
                <div className="mt-4 flex justify-end gap-2">
                  <UpdateProduct id={product.id} />
                  <DeleteProduct id={product.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
