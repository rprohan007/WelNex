import React from 'react';
import { AssetCard, type AssetCardProps } from './AssetCard';

export type InvestmentCardProps = AssetCardProps;

/**
 * InvestmentCard component provides dynamic multi-ticker live price hydration,
 * CURRENT PRICE & MIN. INVESTMENT live reflection, Live IST timestamp badge,
 * and reliable Admin CMS price fallback for unlisted assets.
 */
export const InvestmentCard: React.FC<InvestmentCardProps> = (props) => {
  return <AssetCard {...props} />;
};

export default InvestmentCard;
