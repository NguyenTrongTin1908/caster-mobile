
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  ISettings
} from 'src/interfaces';
import { paymentService } from 'services/payment.service';
import { connect } from 'react-redux';
// import { loadStripe } from 'stripe/stripe-js';
// import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
// import { getCurrentUser } from 'services/redux/auth/actions';
// import StripeCardForm from 'components/user/stripe-card-form';
import React, { useState } from 'react';
import { Alert, View } from 'native-base';


interface IProps {
  settings: ISettings;
  getCurrentUser: Function;
}


const NewCardPage = ({settings, getCurrentUser : handleUpdateCurrentUser}:IProps) => {
  const authenticate = true;


  const [submitting, setSubmitting] = useState(false);


  const handleAddCard = async(source: any) =>{
    try {
      setSubmitting(true)

      await paymentService.addStripeCard({ sourceToken: source.id });
      handleUpdateCurrentUser();
      Alert('Payment card added successfully')
    } catch (error) {
      const e = await error;
      Alert('An error occured. Please try again.');
      setSubmitting(false)

    }
  }



    return (

        <View>
          <View>
            {/* <Elements stripe={loadStripe(settings.stripePublishableKey || '')}>
              <ElementsConsumer>
                {({ stripe, elements }) => (
                  <StripeCardForm submit={handleAddCard.bind(this)} stripe={stripe} elements={elements} submiting={submitting} />
                )}
              </ElementsConsumer>

            </Elements> */}
          </View>
        </View>
    );
}

const mapState = (state: any) => ({
  ui: { ...state.ui },
  settings: { ...state.settings }
});
const mapDispatch = {  };
export default connect(mapState, mapDispatch)(NewCardPage);
