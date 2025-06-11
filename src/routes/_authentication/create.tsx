import { Box, Button, Flex, Heading, HStack, Icon, IconButton, Input, Textarea, VStack } from '@chakra-ui/react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Plus, Trash } from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';

import { MemeEditor } from '../../components/meme-editor';
import { MemePictureProps } from '../../components/meme-picture';
import { useCreateMeme } from '../../hooks/useCreateMeme';

export const Route = createFileRoute('/_authentication/create')({
  component: CreateMemePage,
});

type Picture = {
  url: string;
  file: File;
};

function CreateMemePage() {
  const navigate = useNavigate();

  const [picture, setPicture] = useState<Picture | null>(null);
  const [texts, setTexts] = useState<MemePictureProps['texts']>([]);

  const handleDrop = (file: File) => {
    setPicture({
      url: URL.createObjectURL(file),
      file,
    });
  };

  const handleAddCaptionButtonClick = () => {
    setTexts([
      ...texts,
      {
        content: `New caption ${texts.length + 1}`,
        x: Math.random() * 400,
        y: Math.random() * 225,
      },
    ]);
  };

  const handleCaptionChange = (index: number, value: string) => {
    setTexts(texts.map((text, i) => (i === index ? { ...text, content: value } : text)));
  };

  const handleDeleteCaptionButtonClick = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  const { createMeme, createdMeme } = useCreateMeme();

  useEffect(() => {
    if (createdMeme) {
      navigate({ to: '/' });
    }
  }, [createdMeme, navigate]);

  const handleSubmit = () => {
    if (!memePicture || !picture) {
      return;
    }
    createMeme({
      picture: picture.file,
      description: 'test',
      texts: texts.map((text) => ({
        content: text.content,
        x: Math.round(text.x),
        y: Math.round(text.y),
      })),
    });
  };

  const memePicture = useMemo(() => {
    if (!picture) {
      return undefined;
    }

    return {
      pictureUrl: picture.url,
      texts,
    };
  }, [picture, texts]);

  return (
    <Flex width="full" height="full">
      <Box flexGrow={1} height="full" p={4} overflowY="auto">
        <VStack spacing={5} align="stretch">
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Upload your picture
            </Heading>
            <MemeEditor onDrop={handleDrop} memePicture={memePicture} />
          </Box>
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Describe your meme
            </Heading>
            <Textarea placeholder="Type your description here..." />
          </Box>
        </VStack>
      </Box>
      <Flex flexDir="column" width="30%" minW="250" height="full" boxShadow="lg">
        <Heading as="h2" size="md" mb={2} p={4}>
          Add your captions
        </Heading>
        <Box p={4} flexGrow={1} height={0} overflowY="auto">
          <VStack>
            {texts.map((text, index) => (
              <Flex width="full">
                <Input
                  key={index}
                  value={text.content}
                  mr={1}
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                />
                <IconButton
                  onClick={() => handleDeleteCaptionButtonClick(index)}
                  aria-label="Delete caption"
                  icon={<Icon as={Trash} />}
                />
              </Flex>
            ))}
            <Button
              colorScheme="dark"
              leftIcon={<Icon as={Plus} />}
              variant="ghost"
              size="sm"
              width="full"
              onClick={handleAddCaptionButtonClick}
              isDisabled={memePicture === undefined}
            >
              Add a caption
            </Button>
          </VStack>
        </Box>
        <HStack p={4}>
          <Button as={Link} to="/" colorScheme="dark" variant="outline" size="sm" width="full">
            Cancel
          </Button>
          <Button
            backgroundColor="black"
            color="white"
            size="sm"
            width="full"
            isDisabled={memePicture === undefined}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}
