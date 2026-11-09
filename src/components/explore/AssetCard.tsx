import React from 'react';
import { InvestmentCard, type InvestmentCardProps } from './InvestmentCard';

export type AssetCardProps = InvestmentCardProps;

/**
 * AssetCard component provides dynamic NSE live price hydration,
 * "Live NSE Tick" badge, and Admin CMS minimum ticket fallback for private fractional CRE.
 */
export const AssetCard: React.FC<AssetCardProps> = (props) => {
  return <InvestmentCard {...props} />;
};

export default AssetCard;
export { InvestmentCard };
export type { InvestmentCardProps };
