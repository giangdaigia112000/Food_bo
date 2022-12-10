import { Select } from "antd";
import { useRouter } from "next/router";
const { Option } = Select;

interface Props {
    optionSearch: any;
    placeholder: string;
    listOption: { value: any; title: string }[];
}

const OptionSearch = ({ optionSearch, placeholder, listOption }: Props) => {
    const { locale } = useRouter();
    return (
        <>
            <Select
                allowClear
                placeholder={placeholder}
                onChange={optionSearch}
                style={{ width: 200 }}
            >
                {listOption.length > 0 &&
                    listOption.map((op) => (
                        <Option key={op.value} value={op.value}>
                            {op.title}
                        </Option>
                    ))}
            </Select>
        </>
    );
};

export default OptionSearch;
