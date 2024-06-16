import EmptyState from "@/components/util/EmptyState";
import { HTMLAttributes } from "react";

const DashboardPage = () => {
    const props: HTMLAttributes<HTMLLIElement> & {key: string, "data-option-index": number} = {
        "key": "Miami, FL, USA",
        "tabIndex": -1,
        "role": "option",
        "id": "location-input-option-0",
        "data-option-index": 0,
        "aria-disabled": false,
        "aria-selected": false,
        "className": "MuiAutocomplete-option"
    }

    const { key } = props;
    return (
        <div className="w-full">
            <div className="grid">
                <div className="tile-card col-12 xl:col-12">
                    <EmptyState />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
