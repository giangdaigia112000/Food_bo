import { Input } from "antd";
const Search = Input.Search;

interface Props {
    userSearch: any;
    placeholder: string;
}

const TitleSearch = ({ userSearch, placeholder }: Props) => {
    return (
        <>
            <Input.Search
                allowClear
                placeholder={placeholder}
                onSearch={userSearch}
                style={{ width: 200 }}
            />
        </>
    );
};

export default TitleSearch;
