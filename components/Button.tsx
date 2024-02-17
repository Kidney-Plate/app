import { Link } from "expo-router";
import { GestureResponderEvent, Pressable, Text } from "react-native";

interface Props {
  text: string;
  onPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  link?: string;
}

const PrimaryButton = (props: Props) => {
  return (
    <Pressable
      className="bg-primary p-3 rounded-lg mt-4 active:bg-primaryDarker active:scale-[.97] transition"
      onPress={props.onPress}
    >
      <Text className="text-white text-lg text-center font-bold">
        {props.text}
      </Text>
    </Pressable>
  );
};

const Button = (props: Props) => {
  if (props.link) {
    return (
      <Link href={props.link} asChild>
        <PrimaryButton onPress={props.onPress} text={props.text} />
      </Link>
    );
  } else {
    return <PrimaryButton onPress={props.onPress} text={props.text} />;
  }
};

export default Button;
