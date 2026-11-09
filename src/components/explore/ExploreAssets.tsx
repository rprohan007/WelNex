import React from 'react';
import { ExploreCatalogue, type ExploreCatalogueProps } from './ExploreCatalogue';

export type ExploreAssetsProps = ExploreCatalogueProps;

/**
 * ExploreAssets Catalogue View
 * Renders investment assets with live dynamic NSE ticker pricing for REITs/InvITs
 * and preserves Admin CMS edited minimum ticket sizes for private fractional CRE.
 */
export const ExploreAssets: React.FC<ExploreAssetsProps> = (props) => {
  return <ExploreCatalogue {...props} />;
};

export default ExploreAssets;
export { ExploreCatalogue };
export type { ExploreCatalogueProps };
