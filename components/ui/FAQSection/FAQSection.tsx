import CollapsibleCard from "./CollapsibleCard";
import { ScrollView, Image, View } from "react-native";
import { CardsContainer, ImageContainer } from "./FAQSection.styles";

const FAQSection = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ paddingBottom: 25 }}>
        <ImageContainer>
          <Image
            source={require("@/assets/images/krizzle_faq.png")}
            style={{ width: "100%", height: 90, resizeMode: "contain" }}
          />
        </ImageContainer>
        <CardsContainer>
          <CollapsibleCard
            faqTitle="Collection"
            faqQuestion="What is a "
            faqContent="Krizzle’s Collections let you group related Items  into a single custom Page. Add, edit and remove items as you wish."
            faqExampleHeading="Example of different Collections"
            faqExampleImage={require("@/assets/images/faq/faq_collections.png")}
            imageHeight={270}
          />
          <CollapsibleCard
            faqTitle="Collection List"
            faqQuestion="What is a "
            faqContent="When creating a Collection you will be asked to add at least one List to your Collection. Krizzle’s Collections Lists make it possible for you to group together items within Collections. It’s perfect if you wish to have different grouped Lists within your Collections and toggle between them. Make Collections completely your own!"
            faqExampleHeading="Example with Food Spots"
            faqExampleImage={require("@/assets/images/faq/faq_lists.png")}
            imageHeight={170}
          />
          <CollapsibleCard
            faqQuestion="What is a "
            faqTitle="Collection Item Template"
            faqContent="When creating a Collection you will be asked to create an Item Template for your Collection. This is a completely customizable template that will include all the fields you can fill out when adding a new Item inside your Collection. In there you can choose between the types text, date, rating, multi-select, link or an image. With a total of up to ten of these fields you can create a form fully tailored to your own needs."
            faqExampleHeading="Example of a Text Field"
            faqExampleImage={require("@/assets/images/faq/faq_item_template.png")}
            imageHeight={210}
          />
          <CollapsibleCard
            faqQuestion="What is a "
            faqTitle="multi-select"
            faqContent="When creating a Collection, you can add an Item Template with the “multi-select” type. A multi-select lets you define a custom list of options that fit your needs. Then, whenever you add a new Item to the Collection, you can simply choose the option—or options—that best apply to that Item."
            faqExampleHeading="Example for a Games Collection: Genres"
            faqExampleImage={require("@/assets/images/faq/faq_multi-select.png")}
            imageHeight={150}
          />
          <CollapsibleCard
            faqQuestion="What is a "
            faqTitle="Widget"
            faqContent="A Krizzle Widget is a visual tile that represents either a Note or a Collection. It displays the title and tag you've assigned, making it easy to identify at a glance. During creation or editing, you can customize its color to better organize or personalize your layout. Widgets are automatically shown on your home page by default, giving you quick access to your most active content. When a Widget is no longer needed on the home page, you can move it to the archive to keep things tidy without deleting it."
            faqExampleHeading="Example of a Widget"
            faqExampleImage={require("@/assets/images/faq/faq_widget.png")}
            imageHeight={125}
          />
          <CollapsibleCard
            faqQuestion="What is the "
            faqTitle="Archive"
            faqContent="Move Widgets to the Archive to declutter your home page. This is an easy way to have an organized home page without commiting to deleting old Widgets."
          />
          <CollapsibleCard
            faqQuestion="What is a "
            faqTitle="Folder"
            faqContent="Folders in Krizzle help you keep your workspace tidy by grouping related widgets, such as Notes or Collections, into one organized place"
          />
        </CardsContainer>
      </View>
    </ScrollView>
  );
};

export default FAQSection;
