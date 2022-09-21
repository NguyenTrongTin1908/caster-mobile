import {  useState } from 'react';
import {
  TextInput, Button,View
} from 'react-native';
import {
  Radio,
  Select
} from 'native-base';

import { omit } from 'lodash';
// import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import Ionicons from "react-native-vector-icons/Ionicons";

import { ICountry, IBody } from 'interfaces/index';
// import type { RadioChangeEvent } from 'antd';

interface IProps {
  onSubmit: Function;
  countries: ICountry[];
  bodyInfo: IBody;
}

const PerformerAdvancedFilter= ({onSubmit,countries,bodyInfo} : IProps) =>  {
   const [showMore,setShowMore]= useState(false)
   const [value, setValue] = useState("one");
   const {
    heights = [],
    weights = [],
    bodyTypes = [],
    genders = [],
    sexualOrientations = [],
    ethnicities = [],
    hairs = [],
    eyes = [],
    butts = [],
    ages = []
  } = bodyInfo;


  const handleSubmit = ()=> {
    onSubmit(omit(state, ['showMore']));
  }

  const handleSubmitRadio = async (e: RadioChangeEvent) => {
    await setState({ sortBy: e.target.value });
    onSubmit(omit(state, ['showMore']));
  };

  return (

    <View style={{ width: '100%' }}>
      <View >
        <View>
          <TextInput>
              placeholder="Enter keyword"
              onChange={(evt) => setState({ q: evt.target.value })}
              onPressEnter={handleSubmit.bind(}
          </TextInput>
        </View>
        <View>
          <Radio.Group name="myRadioGroup" accessibilityLabel="favorite number" value={value} onChange={nextValue => {
          setValue(nextValue);
          }}>
                <Radio value="mostFollowed">Most Followed</Radio>
                <Radio value="earningCurrentMonth">Most Supported month</Radio>
                <Radio value="mostView">Most total views</Radio>
          </Radio.Group>;
        </View>
        <View>
            <Button
              style={{ width: '100%' }}
              onPress={() => setShowMore(!showMore )}
            >
              Advanced search
              {' '}
              {showMore ? <Ionicons name='arrow-up-outline' /> : <Ionicons name='arrow-down-outline' />}
            </Button>
        </View>
      </View>
      <View>
        <View>
            <Select
              onValueChange={(val: any) => setState({ isFreeSubscription: val === 'false' ? false : val === 'true' ? true : '' }, () => handleSubmit())}
              style={{ width: '100%' }}
              defaultValue=""
            >
              <Select.Item label="all" value="">
                All subscriptions
              </Select.Item>
              <Select.Item label="false" value="false">
                Non-free subscription
              </Select.Item>
              <Select.Item label="true" value="true">
                Free subscription
              </Select.Item>
            </Select>
        </View>
        {countries && countries.length > 0 && (
            <div className="filter-item">
              <Select
                onValueChange={(val) => setState({ country: val }, () => handleSubmit())}
                style={{ width: '100%' }}
                placeholder="Countries"
                defaultValue=""
                showSearch
                optionFilterProp="label"
              >
                <Select.Item key="All" label="" value="">
                  All countries
                </Select.Item>
                {countries.map((c) => (
                  <Select.Item key={c.code} label={c.name} value={c.code}>
                    <img alt="flag" src={c.flag} width="25px" />
                    &nbsp;
                    {c.name}
                  </Select.Item>
                ))}
              </Select>
            </div>
          )}
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ gender: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              defaultValue=""
            >
              <Select.Item key="all" label="all" value="">
                All genders
              </Select.Item>
              {genders.map((s) => (
                <Select.Item key={s.value} label={s.value} value={s.value}>
                  {s.text}
                </Select.Item>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ sexualOrientation: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              defaultValue=""
            >
              <Select.Item key="all" label='all' value="">
                All sexual orientations
              </Select.Item>
              {sexualOrientations.map((s) => (
                <Select.Item key={s.value} label={s.value} value={s.value}>
                  {s.text}
                </Select.Item>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ age: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Age"
              defaultValue=""
            >
              <Select.Item key="all" label="all" value="">
                All ages
              </Select.Item>
              {ages.map((s) => (
                <Select.Item key={s.value} label={s.value} value={s.value}>
                  {s.text}
                </Select.Item>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ eyes: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Eye color"
              defaultValue=""
            >
              <Select.Item key="all" label="all" value="">
                All eye colors
              </Select.Item>
              {eyes.map((s) => (
                <Select.Item key={s.value} label={s.value} value={s.value}>
                  {s.text}
                </Select.Item>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ hair: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Hair color"
              defaultValue=""
            >
              <Select.Item key="all" label="all" value="">
                All hair colors
              </Select.Item>
              {hairs.map((s) => (
                <Select.Item key={s.value} label={s.value} value={s.value}>
                  {s.text}
                </Select.Item>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ butt: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Butt size"
              defaultValue=""
            >
              <Select.Item key="all" label="all" value="">
                All butt size
              </Select.Item>
              {butts.map((s) => (
                <Select.Item key={s.value} label={s.value} value={s.value}>
                  {s.text}
                </Select.Item>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ height: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Height"
              defaultValue=""
            >
              <Select.Item key="all" label="all" value="">
                All heights
              </Select.Item>
              {heights.map((s) => (
                <Select.Item key={s.value} label={s.value} value={s.value}>
                  {s.text}
                </Select.Item>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ weight: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Weight"
              defaultValue=""
            >
              <Select.Item key="all" label="All weights"  value="">
                All weights
              </Select.Item>
              {weights.map((i) => (
                <Select.Item key={i.text} label ={i.text} value={i.text}>
                  {i.text}
                </Select.Item>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ ethnicity: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Ethnicity"
              defaultValue=""
            >
              <Select.Item key="all" label="all" value="">
                All ethnicities
              </Select.Item>
              {ethnicities.map((s) => (
                <Select.Item key={s.value} label={s.value} value={s.value}>
                  {s.text}
                </Select.Item>
              ))}
            </Select>
          </div>
          <div className="filter-item">
            <Select
              onValueChange={(val) => setState({ bodyType: val }, () => handleSubmit())}
              style={{ width: '100%' }}
              placeholder="Body type"
              defaultValue=""
            >
              <Select.Item key="all" label="all" value="">
                All body types
              </Select.Item>
              {bodyTypes.map((s) => (
                <Select.Item key={s.value} label={s.value} value={s.value}>
                  {s.text}
                </Select.Item>
              ))}
            </Select>
          </div>
      </View>
    </View>
  )




}
