import React, { useEffect, useState } from "react";
import { Select, View } from "native-base";
import DatePicker from "react-native-datepicker";
import { colors } from "utils/theme";
import styles from "./style";

const Products = [
  {
    key: "paypal",
    text: "Paypal",
  },
  {
    key: "stripe",
    text: "Stripe",
  },
  {
    key: "live",
    text: "Live",
  },
  {
    key: "private chat",
    text: "Private Chat",
  },
  {
    key: "sposorship",
    text: "Sposorship",
  },
  {
    key: "mailMeFee",
    text: "Mail Me Fee",
  },
];

interface IProps {
  onSubmit: Function;
}

const OrderSearchFilter = ({ onSubmit }: IProps): React.ReactElement => {
  const [productInfo, setProductInfo] = useState("");
  const [fromDate, setFromDate] = useState(null) as any;
  const [toDate, setToDate] = useState(null) as any;
  const [filter, setFilter] = useState({} as any);

  const handleSubmit = async (field, value: any) => {
    if (field === "toDate" || field === "fromDate") {
      const [day, month, year] = value.split("-");
      const datePick = new Date(+year, month - 1, +day);
      const dateField = datePick.toISOString();
      await setFilter({ ...filter, [field]: dateField });
    } else {
      await setFilter({ ...filter, [field]: value });
    }
  };

  useEffect(() => {
    onSubmit(filter);
  }, [filter]);

  return (
    <View flexDirection={"row"}>
      <View w={"30%"}>
        <Select
          onValueChange={(val) => {
            setProductInfo(val), handleSubmit("productInfo", val);
          }}
          selectedValue={productInfo}
          style={{ width: "100%" }}
          fontSize={17}
          color={colors.lightText}
          defaultValue="All"
        >
          <Select.Item label="All" key="all" value=""></Select.Item>
          {Products.map((s) => (
            <Select.Item
              label={s.text || s.key}
              key={s.key}
              value={s.key}
            ></Select.Item>
          ))}
        </Select>
      </View>
      <View w={"35%"}>
        <DatePicker
          modal
          style={styles.editDatePicker}
          placeholder="From Date"
          format="DD-MM-YYYY"
          date={fromDate}
          customStyles={{
            dateIcon: {
              position: "absolute",
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
            dateText: { fontSize: 17, color: colors.lightText },
          }}
          onDateChange={(val) => {
            setFromDate(val), handleSubmit("fromDate", val);
          }}
        />
      </View>
      <View w={"35%"}>
        <DatePicker
          modal
          style={styles.editDatePicker}
          placeholder="To Date"
          format="DD-MM-YYYY"
          date={toDate}
          customStyles={{
            dateIcon: {
              position: "absolute",
              left: 0,
              top: 4,
              marginLeft: 0,
            },
            dateInput: {
              marginLeft: 36,
            },
            dateText: { fontSize: 17, color: colors.lightText },
          }}
          onDateChange={(val) => {
            setToDate(val), handleSubmit("toDate", val);
          }}
        />
      </View>
    </View>
  );
};
export default OrderSearchFilter;
