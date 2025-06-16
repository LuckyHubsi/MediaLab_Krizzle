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
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel="FAQ page"
            accessibilityHint="This page containes answers to the most frequently asked questions about Krizzle!"
          />
        </ImageContainer>
        <CardsContainer>
          <CollapsibleCard
            faqTitle="Collection"
            faqQuestion="What is a "
            faqContent="Krizzle’s Collections let you group related Items  into a single custom Page. Add, edit and remove items as you wish."
            faqExampleHeading="Example of different Collections"
            faqExampleImage={require("@/assets/images/faq/faq_collections.png")}
            faqExampleImageAlt="4 different collection widgets. Collection 1 with title thrifting finds, tag thrifting, color gradient blue and icon shopping cart. Collection 2 with title daily journal, tag journaling, color blue and icon thinking. Collection 3 with title games 2025, tag games, color lavender and icon mug. Collection 4 with title books 2025, tag books, color pink and icon book."
            imageHeight={270}
            itemNumber={1}
          />
          <CollapsibleCard
            faqTitle="Collection List"
            faqQuestion="What is a "
            faqContent="Krizzle’s Collections Lists make it possible for you to group together items within Collections. It’s perfect if you wish to have different grouped Lists within your Collections and toggle between them. When creating a Collection you will have a predefined List called 'General' added to your Collection, but you can edit them however you like. Make Collections completely your own!"
            faqExampleHeading="Example with Food Spots"
            faqExampleImage={require("@/assets/images/faq/faq_lists.png")}
            faqExampleImageAlt="different collection lists representing citys for a collection called Food spots. List names include Vienna, Tokyo, Seoul and London."
            imageHeight={170}
            itemNumber={2}
          />
          <CollapsibleCard
            faqQuestion="What is a "
            faqTitle="Collection Item Template"
            faqContent="When creating a Collection you will be asked to create an Item Template for your Collection. This is a completely customizable template that will include all the fields you can fill out when adding a new Item inside your Collection. In there you can choose between the types text, date, rating, multi-select, link or an image. With a total of up to ten of these fields you can create a form fully tailored to your own needs."
            faqExampleHeading="Example of a Text Field"
            faqExampleImage={require("@/assets/images/faq/faq_item_template.png")}
            faqExampleImageAlt="field of type text and set to preview for a collection template."
            imageHeight={210}
            itemNumber={3}
          />
          <CollapsibleCard
            faqQuestion="What is a "
            faqTitle="Multi-Select"
            faqContent="When creating a Collection, you can add an Item Template with the “multi-select” type. A multi-select lets you define a custom list of options that fit your needs. Then, whenever you add a new Item to the Collection, you can simply choose the option—or options—that best apply to that Item."
            faqExampleHeading="Example for a Games Collection: Genres"
            faqExampleImage={require("@/assets/images/faq/faq_multi-select.png")}
            faqExampleImageAlt="different selectables for game genres. The selectables include shooter and mmo which have been selected as well as not selected selectables called puzzle, sandbox, adventure, survival horror, fighting, platform, strategy and simulation."
            imageHeight={150}
            itemNumber={4}
          />
          <CollapsibleCard
            faqQuestion="What is a "
            faqTitle="Widget"
            faqContent="A Krizzle Widget is a visual tile that represents either a Note or a Collection. It displays the title and tag you've assigned, making it easy to identify at a glance. During creation or editing, you can customize its color to better organize or personalize your layout. Widgets are automatically shown on your home page by default, giving you quick access to your most active content. When a Widget is no longer needed on the home page, you can move it to the archive to keep things tidy without deleting it."
            faqExampleHeading="Example of a Widget"
            faqExampleImage={require("@/assets/images/faq/faq_widget.png")}
            faqExampleImageAlt="2 different widgets, one collection and one note. Collection with title games 2025, tag games, color gradient blue and icon book. Note with title Grocery List, tag groceries, color gradient pink and icon thinking."
            imageHeight={125}
            itemNumber={5}
          />
          <CollapsibleCard
            faqQuestion="What is the "
            faqTitle="Archive"
            faqContent="Move Widgets to the Archive to declutter your home page. This is an easy way to have an organized home page without commiting to deleting old Widgets."
            itemNumber={6}
          />
          <CollapsibleCard
            faqQuestion="What is a "
            faqTitle="Folder"
            faqContent="Folders in Krizzle help you keep your workspace tidy by grouping related widgets, such as Notes or Collections, into one organized place"
            itemNumber={7}
          />
          <CollapsibleCard
            faqQuestion="What is "
            faqTitle="Long-Press"
            faqContent="Long-pressing on a Widget or a Collection Item allows you to quickly access options like editing, archiving, or deleting the Widget."
            itemNumber={8}
          />
        </CardsContainer>
        {/* change the number of questions inside CollapsibleCard when adding a new FAQ card */}
      </View>
    </ScrollView>
  );
};

export default FAQSection;
