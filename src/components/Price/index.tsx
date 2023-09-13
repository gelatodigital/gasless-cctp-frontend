interface PriceProps {
    amount: bigint | null;
    decimals: number | null;
}

const Price = ({ amount, decimals }: PriceProps) => (
    <span>{ '$' + (Number(amount) / 10 ** Number(decimals)).toFixed(2) }</span>
);

export default Price;
