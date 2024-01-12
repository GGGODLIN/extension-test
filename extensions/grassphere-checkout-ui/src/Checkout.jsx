import React, { useState, useEffect } from 'react';
import {
  reactExtension,
  TextField,
  BlockStack,
  useApplyMetafieldsChange,
  useMetafield,
  Checkbox,
  InlineStack,
  ChoiceList,
  Choice,
  Pressable,
  Link,
  useCheckoutToken,
  useShop,
  Text,
  Image,
  InlineLayout,
} from '@shopify/ui-extensions-react/checkout';

// Set the entry point for the extension
export default reactExtension('purchase.checkout.block.render', () => <App />);

function App() {
  // Set up the checkbox state
  const [checked, setChecked] = useState(false);
  const [cvsState, setCvsState] = useState(null);
  const testData = useCheckoutToken();
  const testData2 = useShop();
  console.log('testData2', testData2, testData);

  // Define the metafield namespace and key
  const metafieldNamespace = 'yourAppNamespace';
  const metafieldKey = 'deliveryInstructions';

  // Get a reference to the metafield
  const deliveryInstructions = useMetafield({
    namespace: metafieldNamespace,
    key: metafieldKey,
  });
  // Set a function to handle updating a metafield
  const applyMetafieldsChange = useApplyMetafieldsChange();

  // Set a function to handle the Checkbox component's onChange event
  const handleChange = () => {
    setChecked(!checked);
  };
  // Render the extension components
  //let link = 'http://localhost:8000/test.html'
  let ExtraData = { redirectUrl: `https://${testData2?.myshopifyDomain}/checkout`, checkoutToken: testData };
  let link = `https://philipextensiontest.myshopify.com/pages/test-page?ExtraData=${JSON.stringify(ExtraData)}`;
  useEffect(() => {
    fetch(`https://philip.akohub.dev/ako/shopify/checkout/cvs/${testData}`)
      .then((res) => res.json())
      .then((json) => {
        console.log('cvs', json);
        setCvsState(json?.cvsResult?.cvsResult);
      });
  }, []);
  return (
    <ChoiceList
      name="choice"
      value="first"
      onChange={(value) => {
        console.log(`onChange event with value: ${value}`);
      }}
    >
      <BlockStack spacing={'none'}>
        <Pressable
          border={['base', 'base', 'base', 'base']}
          cornerRadius={['base', 'base', 'none', 'none']}
          padding="base"
        >
          <Choice id="second">宅配</Choice>
        </Pressable>
        <Pressable
          border={['none', 'base', 'base', 'base']}
          cornerRadius={['none', 'none', 'base', 'base']}
          padding={['tight', 'base']}
        >
          <InlineLayout blockAlignment="center" columns={['auto', 'fill']}>
            <Choice id="first">超商取貨</Choice>
            <InlineStack inlineAlignment="end" blockAlignment="center">
              <Link to={link} external={false}>
                <Image source="https://cdn.shopify.com/s/files/1/0846/1788/8039/files/711-icon_34x33_81d376eb-9530-4fd7-8f7f-fd60af918487.png?v=1703144399" />
              </Link>
              {cvsState && (
                <Text>
                  {cvsState?.cvsStoreName},{cvsState?.cvsAddress}
                </Text>
              )}
            </InlineStack>
          </InlineLayout>
        </Pressable>
      </BlockStack>
    </ChoiceList>
  );
}
