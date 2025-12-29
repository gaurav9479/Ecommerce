import React from 'react';

const LoadingSkeleton = ({ variant = 'product', count = 1 }) => {
  const renderProductSkeleton = () => (
    <div className="glass rounded-xl p-4 space-y-4">
      <div className="w-full h-56 skeleton rounded-lg"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-text w-1/2"></div>
      <div className="flex gap-2">
        <div className="skeleton h-10 flex-1 rounded-lg"></div>
        <div className="skeleton h-10 w-10 rounded-lg"></div>
      </div>
    </div>
  );

  const renderDetailSkeleton = () => (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="w-full h-96 skeleton rounded-xl"></div>
   <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="skeleton h-8 w-3/4"></div>
        <div className="skeleton h-6 w-1/2"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
        <div className="skeleton-text w-2/3"></div>
        <div className="flex gap-4">
          <div className="skeleton h-12 flex-1 rounded-lg"></div>
          <div className="skeleton h-12 w-12 rounded-lg"></div>
        </div>
      </div>
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass rounded-lg p-4 flex gap-4">
          <div className="skeleton h-24 w-24 rounded-lg"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-3/4"></div>
            <div className="skeleton h-4 w-1/2"></div>
            <div className="skeleton h-4 w-1/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (variant === 'product') {
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <div key={i}>{renderProductSkeleton()}</div>
        ))}
      </>
    );
  }

  if (variant === 'detail') {
    return renderDetailSkeleton();
  }

  if (variant === 'list') {
    return renderListSkeleton();
  }

  return null;
};

export default LoadingSkeleton;
