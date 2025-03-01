import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { StudySetEntity } from './entities/study-set.entity';
import { UserEntity } from '../auth/entities/user.entity';
import { CreateStudySetDto } from './dto/bodies/create-study-set.dto';
import { CreateStudySetResponseInterface } from './interfaces/create-study-set-response.interface';
import { SubjectEntity } from './entities/subject.entity';
import { ColorEntity } from './entities/color.entity';
import { GetAllStudySetResponseInterface } from './interfaces/get-all-study-set-response.interface';
import { GetStudySetsByOwnerIdDto } from './dto/params/get-study-sets-by-ownerId.dto';
import { GetStudySetByIdDto } from './dto/params/get-study-set-by-id.dto';
import { UpdateStudySetByIdBodyDto } from './dto/bodies/update-study-set-by-id-body.dto';
import { UpdateStudySetByIdParamDto } from './dto/params/update-study-set-by-id-param.dto';
import { DeleteStudySetByIdParamDto } from './dto/params/delete-study-set-by-id-param.dto';
import { DeleteStudySetResponseInterface } from './interfaces/delete-study-set-response.interface';
import { DuplicateStudySetDto } from './dto/bodies/duplicate-study-set.dto';
import { SearchStudySetsQueryDto } from './dto/queries/search-study-sets-query.dto';
import { FlashcardEntity } from 'src/flashcard/entities/flashcard.entity';
import { FlashcardStatusEnum } from 'src/flashcard/enums/flashcard-status.enum';
import { ResetFlashcardProgressParamDto } from './dto/params/reset-flashcard-progress-param.dto';
import { ResetFlashcardProgressResponseInterface } from './interfaces/reset-flashcard-progress-response.interface';
import { FlipFlashcardStatus } from '../flashcard/enums/flip-flashcard-status';
import { ImportFlashcardDto } from './dto/bodies/import-flashcard.dto';
import axios from 'axios';
import { ImportFlashcardFromQuizletParamDto } from './dto/params/import-flashcard-from-quizlet.param.dto';
import { ConfigService } from '@nestjs/config';
import { CreateStudySetFromAiDto } from './dto/bodies/create-study-set-from-ai.dto';
import { ResetFlashcardProgressParamsDto } from './dto/queries/reset-flashcard-progress-params.dto';
import { GetStudySetsByOwnerIdQueryDto } from './dto/queries/get-study-sets-by-owner-Id-query.dto';
import { UpdateFoldersInStudySetResponseInterface } from './interfaces/update-folders-in-study-set-response.interface';
import { UpdateFoldersInStudySetDto } from './dto/bodies/update-folders-in-study-set.dto';
import { FolderEntity } from '../folder/entities/folder.entity';
import { UpdateClassesInStudySetDto } from './dto/bodies/update-classes-in-study-set.dto';
import { UpdateClassesInStudySetResponseInterface } from './interfaces/update-classes-in-study-set-response.interface';
import { ClassEntity } from '../class/entities/class.entity';
import {
  GoogleGenerativeAI,
  ResponseSchema,
  SchemaType,
} from '@google/generative-ai';
import { GetStudySetByCodeParamDto } from './dto/params/get-study-set-by-code.param.dto';
import { GetStudySetsBySubjectIdParamDto } from './dto/params/get-study-sets-by-subject-id-param.dto';
import { GetStudySetsBySubjectIdQueryDto } from './dto/queries/get-study-sets-by-subject-id-query.dto';
import { TopSubjectResponseInterface } from './interfaces/top-subject-response.interface';
import { QuizFlashcardStatusEnum } from '../flashcard/enums/quiz-flashcard-status.enum';
import { TrueFalseStatusEnum } from '../flashcard/enums/true-false-status.enum';
import { WriteStatusEnum } from '../flashcard/enums/write-status.enum';
import { UpdateRecentStudySetDto } from './dto/bodies/update-recent-study-set-body.dto';
import { RecentStudySetEntity } from './entities/recent-study-set.entity';
import { GetStudySetsByUserIdDto } from './dto/params/get-study-sets-by-user-Id.dto';
import { UserStatusEnum } from '../auth/enums/user-status.enum';
import { AnalyzeStudySetDto } from './dto/bodies/analyze-study-set.dto';
import { LearnModeEnum } from '../flashcard/enums/learn-mode.enum';
import { CreateWriteHintBodyDto } from './dto/bodies/create-write-hint-body.dto';
import { CreateWriteHintResponseInterface } from './interfaces/create-write-hint-response.interface';
import { DeleteAllStudySetByUserIdParamDto } from './dto/params/delete-all-study-set-by-user-id-param.dto';

@Injectable()
export class StudySetRepository extends Repository<StudySetEntity> {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    super(StudySetEntity, dataSource.createEntityManager());
  }

  async createStudySet(
    createStudySetDto: CreateStudySetDto,
  ): Promise<CreateStudySetResponseInterface> {
    const studySet = new StudySetEntity();
    studySet.title = createStudySetDto.title;
    studySet.description = createStudySetDto.description;
    studySet.isPublic = createStudySetDto.isPublic;

    try {
      const owner = await this.dataSource
        .getRepository(UserEntity)
        .findOneBy({ id: createStudySetDto.ownerId });

      if (!owner) {
        throw new NotFoundException('User not found or username is missing');
      }
      if (!owner.isVerified) {
        throw new UnauthorizedException('User is not verified');
      }

      if (owner.userStatus === 'BLOCKED') {
        throw new UnauthorizedException('User is banned');
      }

      if (createStudySetDto.subjectId) {
        const subject = await this.dataSource
          .getRepository(SubjectEntity)
          .findOneBy({ id: createStudySetDto.subjectId });
        if (!subject) {
          throw new NotFoundException('Subject not found');
        }
        studySet.subject = subject;
      }

      if (createStudySetDto.colorId) {
        const color = await this.dataSource
          .getRepository(ColorEntity)
          .findOneBy({ id: createStudySetDto.colorId });
        if (!color) {
          throw new NotFoundException('Color not found');
        }
        studySet.color = color;
      }

      studySet.owner = owner;
      studySet.link = this.generateRandomString(7);

      await this.dataSource.getRepository(StudySetEntity).save(studySet);

      return {
        id: studySet.id,
        title: studySet.title,
        subjectId: studySet.subject?.id,
        colorId: studySet.color?.id,
        linkShareCode: studySet.link,
        isPublic: studySet.isPublic,
        isAIGenerated: studySet.isAIGenerated,
        description: studySet.description,
        createdAt: studySet.createdAt,
        updatedAt: studySet.updatedAt,
      };
    } catch (error) {
      console.log('Error creating study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating study set');
    }
  }

  // get all by owner id
  async getStudySetsByOwnerId(
    getStudySetsByOwnerIdDto: GetStudySetsByOwnerIdDto,
    getStudySetsByOwnerIdQueryDto: GetStudySetsByOwnerIdQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    const { ownerId } = getStudySetsByOwnerIdDto;
    const { folderId, classId } = getStudySetsByOwnerIdQueryDto;
    try {
      const studySets = await this.dataSource
        .getRepository(StudySetEntity)
        .find({
          where: { owner: { id: ownerId } },
          relations: [
            'owner',
            'subject',
            'color',
            'flashcards',
            'folders',
            'classes',
          ],
        });

      return studySets.map((studySet) => {
        const isImported =
          studySet.folders.some((folder) => folder.id === folderId) ||
          studySet.classes.some((classItem) => classItem.id === classId);
        return {
          ...this.mapStudySetToResponse(studySet),
          isImported,
        };
      });
    } catch (error) {
      console.log('Error getting study sets', error);
      throw new InternalServerErrorException('Error getting study sets');
    }
  }

  // get study set by id
  async getStudySetById(
    getStudySetByIdDto: GetStudySetByIdDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const { id } = getStudySetByIdDto;
    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { id },
          relations: ['owner', 'subject', 'color', 'flashcards'],
        });

      if (!studySet) {
        throw new NotFoundException('Study set not found');
      }

      return this.mapStudySetToResponse(studySet, true);
    } catch (error) {
      console.log('Error getting study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting study set');
    }
  }

  // update study set by id
  async updateStudySetById(
    updateStudySetByIdParamDto: UpdateStudySetByIdParamDto,
    updateStudySetByIdBodyDto: UpdateStudySetByIdBodyDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const { id } = updateStudySetByIdParamDto;
    // if content are empty, return the original content
    if (
      !updateStudySetByIdBodyDto.title &&
      !updateStudySetByIdBodyDto.description &&
      !updateStudySetByIdBodyDto.isPublic &&
      !updateStudySetByIdBodyDto.subjectId &&
      !updateStudySetByIdBodyDto.colorId
    ) {
      console.log('No content to update');
      return this.getStudySetById({ id });
    }
    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { id },
          relations: ['owner', 'subject', 'color', 'flashcards'],
        });

      if (!studySet) {
        throw new NotFoundException('Study set not found');
      }

      studySet.title = updateStudySetByIdBodyDto.title || studySet.title;
      studySet.description =
        updateStudySetByIdBodyDto.description || studySet.description;
      studySet.isPublic =
        updateStudySetByIdBodyDto.isPublic !== undefined
          ? updateStudySetByIdBodyDto.isPublic
          : studySet.isPublic;

      if (updateStudySetByIdBodyDto.subjectId) {
        const subject = await this.dataSource
          .getRepository(SubjectEntity)
          .findOneBy({ id: updateStudySetByIdBodyDto.subjectId });
        if (!subject) {
          throw new NotFoundException('Subject not found');
        }
        studySet.subject = subject;
      }

      if (updateStudySetByIdBodyDto.colorId) {
        const color = await this.dataSource
          .getRepository(ColorEntity)
          .findOneBy({ id: updateStudySetByIdBodyDto.colorId });
        if (!color) {
          throw new NotFoundException('Color not found');
        }
        studySet.color = color;
      }

      await this.dataSource.getRepository(StudySetEntity).save(studySet);

      return this.mapStudySetToResponse(studySet);
    } catch (error) {
      console.log('Error updating study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error updating study set');
    }
  }

  // delete study set by id
  async deleteStudySetById(
    deleteStudySetByIdParamDto: DeleteStudySetByIdParamDto,
  ): Promise<DeleteStudySetResponseInterface> {
    const { id } = deleteStudySetByIdParamDto;
    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { id },
        });

      if (!studySet) {
        throw new NotFoundException('Study set not found');
      }

      await this.dataSource.getRepository(StudySetEntity).delete(id);
      const response: DeleteStudySetResponseInterface = {
        message: 'Study set deleted successfully',
        studySetId: id,
      };
      console.log('response', response);
      return response;
    } catch (error) {
      console.log('Error deleting study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error deleting study set');
    }
  }

  // duplicate study set by id
  async duplicateStudySet(
    duplicateStudySet: DuplicateStudySetDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const { studySetId, newOwnerId } = duplicateStudySet;
    const studySet = await this.findOne({
      where: { id: studySetId },
      relations: ['flashcards', 'subject', 'color'],
    });
    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    const newOwner = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id: newOwnerId },
    });
    if (!newOwner) {
      throw new NotFoundException('New owner not found');
    }

    if (!newOwner.isVerified) {
      throw new NotFoundException('New owner is not verified');
    }

    const newStudySet = this.create({
      title: studySet.title,
      description: studySet.description,
      isPublic: studySet.isPublic,
      owner: newOwner,
      subject: studySet.subject,
      color: studySet.color,
      flashcards: studySet.flashcards.map((flashcard) => ({
        term: flashcard.term,
        definition: flashcard.definition,
        definitionImageURL: flashcard.definitionImageURL,
        isStarred: flashcard.isStarred,
        hint: flashcard.hint,
        explanation: flashcard.explanation,
        rating: flashcard.rating,
      })),
    });

    try {
      const savedStudySet = await this.save(newStudySet);
      // Duplicate flashcards
      const flashcards = studySet.flashcards.map((flashcard) => {
        const newFlashcard = new FlashcardEntity();
        newFlashcard.term = flashcard.term;
        newFlashcard.definition = flashcard.definition;
        newFlashcard.definitionImageURL = flashcard.definitionImageURL;
        newFlashcard.isStarred = flashcard.isStarred;
        newFlashcard.hint = flashcard.hint;
        newFlashcard.explanation = flashcard.explanation;
        newFlashcard.rating = flashcard.rating;
        newFlashcard.studySet = savedStudySet;
        return newFlashcard;
      });

      await this.dataSource.getRepository(FlashcardEntity).save(flashcards);

      return this.mapStudySetToResponse(savedStudySet, false);
    } catch (error) {
      console.log('Error duplicating study set', error);
      throw new InternalServerErrorException('Error duplicating study set');
    }
  }

  // search study set by title
  async searchStudySetByTitle(
    searchStudySetsQueryDto: SearchStudySetsQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    const {
      title = '',
      creatorType = 'all',
      size = 'all',
      page = 1,
      subjectId = 1, // all
      colorId = 1, // all
      isAIGenerated = false,
    } = searchStudySetsQueryDto;
    if (page < 1) {
      throw new NotFoundException('Invalid page number');
    }

    try {
      const options: any = {
        where: {
          title: title ? ILike(`%${title}%`) : undefined,
          isPublic: true,
          isAIGenerated,
        },
        relations: ['owner', 'flashcards', 'subject', 'color'],
        skip: (page - 1) * 40,
        take: 40,
      };

      // Conditionally add subjectId and colorId filters
      if (subjectId == 1) {
        console.log('subjectId', subjectId);
      } else {
        options.where.subject = { id: subjectId };
      }
      if (colorId == 1) {
        console.log('colorId', colorId);
      } else {
        options.where.color = { id: colorId };
      }

      // Filter by creatorType if provided
      if (creatorType) {
        options.where.owner = options.where.owner || {};
        switch (creatorType) {
          case 'teacher':
            options.where.owner.role = 'TEACHER';
            break;
          case 'student':
            options.where.owner.role = 'USER';
            break;
          default: // 'all'
            break;
        }
      }

      // Apply flashcard count filter
      const studySets = await this.find(options);
      let filteredStudySets = studySets;

      if (size) {
        filteredStudySets = studySets.filter((studySet) => {
          const flashcardCount = studySet.flashcards.length;
          switch (size) {
            case 'lessThan20':
              return flashcardCount < 20;
            case 'between20And49':
              return flashcardCount >= 20 && flashcardCount <= 49;
            case 'moreThan50':
              return flashcardCount > 50;
            default: // 'all'
              return true;
          }
        });
      }

      return filteredStudySets.map((studySet) =>
        this.mapStudySetToResponse(studySet),
      );
    } catch (error) {
      console.log('Error searching study set', error);
      throw new InternalServerErrorException('Error searching study set');
    }
  }

  // Reset progress of all flashcards in a study set
  async resetFlashcardProgress(
    resetFlashcardProgressParamDto: ResetFlashcardProgressParamDto,
    resetFlashcardProgressParamsDto: ResetFlashcardProgressParamsDto,
  ): Promise<ResetFlashcardProgressResponseInterface> {
    const { id } = resetFlashcardProgressParamDto;
    const { resetType } = resetFlashcardProgressParamsDto;
    const studySet = await this.findOne({
      where: { id },
      relations: ['flashcards'],
    });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    for (const flashcard of studySet.flashcards) {
      if (resetType === 'resetAll') {
        flashcard.rating = FlashcardStatusEnum.NOT_STUDIED;
        flashcard.flipStatus = FlipFlashcardStatus.NONE;
        flashcard.quizStatus = QuizFlashcardStatusEnum.NONE;
        flashcard.trueFalseStatus = TrueFalseStatusEnum.NONE;
        flashcard.writeStatus = WriteStatusEnum.NONE;
      } else if (resetType === 'flipStatus') {
        flashcard.flipStatus = FlipFlashcardStatus.NONE;
      } else if (resetType === 'rating') {
        flashcard.rating = FlashcardStatusEnum.NOT_STUDIED;
      } else if (resetType === 'quizStatus') {
        flashcard.quizStatus = QuizFlashcardStatusEnum.NONE;
      } else if (resetType === 'trueFalseStatus') {
        flashcard.trueFalseStatus = TrueFalseStatusEnum.NONE;
      } else if (resetType === 'writeStatus') {
        flashcard.writeStatus = WriteStatusEnum.NONE;
      }
      await this.dataSource.getRepository(FlashcardEntity).save(flashcard);
    }
    return {
      message: 'Flashcard progress reset successfully',
      studySetId: id,
    };
  }

  async importFromUrl(
    importFlashcardDto: ImportFlashcardDto,
    importFlashcardFromQuizletParamDto: ImportFlashcardFromQuizletParamDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const { userId } = importFlashcardFromQuizletParamDto;
    const { url } = importFlashcardDto;
    try {
      console.log(url);
      const quizletId = url.split('/')[4];
      const studySetName = url.split('/')[5].split('-').slice(0, -1).join(' ');
      console.log(quizletId);
      const LIMIT = 1000;
      const quizletUrl = `https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=${quizletId}&filters%5BstudiableContainerType%5D=1&perPage=${LIMIT}&page=1`;
      const apiKey = this.configService.get<string>('SCRAPER_API_KEY');
      const response = await axios.get(`https://api.scraperapi.com/`, {
        params: {
          api_key: apiKey,
          url: quizletUrl,
        },
        timeout: 10000,
      });

      console.log(response.data);

      const data = response.data;

      if (!data.responses || !data.responses.length || !data.responses[0]) {
        throw new Error('Invalid Quizlet response');
      }

      const terms = data.responses[0].models.studiableItem;
      const parsedTerms = [];

      for (const term of terms) {
        const wordSide = term.cardSides.find(
          (side: { label: string }) => side.label === 'word',
        );
        const definitionSide = term.cardSides.find(
          (side: { label: string }) => side.label === 'definition',
        );

        if (!wordSide?.media[0] || !definitionSide?.media[0]) {
          continue;
        }

        const definitionMedia = definitionSide.media.map(
          (media: { plainText: any; attribution: any; url: any }) => ({
            plainText: media.plainText,
            attribution: media.attribution,
            imageUrl: media.url,
          }),
        );

        parsedTerms.push({
          word: wordSide.media[0].plainText,
          definition: definitionSide.media[0].plainText,
          definitionMedia,
        });
      }
      console.log(userId);
      const GeminiAPIKey = this.configService.get<string>('GEMINI_API_KEY');
      const genAI = new GoogleGenerativeAI(GeminiAPIKey);

      const model = this.initializeGenerativeAIModel(
        genAI,
        this.createSchemaGenTitleAndDescription(),
      );

      const prompt = this.createPromptTitleAndDescription(studySetName);

      const result = await model.generateContent(prompt);
      const parsedText = this.parseAIResponse(result);

      const aiGeneratedName = parsedText.name || studySetName;
      const aiGeneratedDescription =
        parsedText.description || 'This study set was imported from Quizlet.';

      // save to database
      const studySet = new StudySetEntity();
      studySet.title = aiGeneratedName;
      studySet.description = aiGeneratedDescription;
      studySet.isPublic = true;
      studySet.link = this.generateRandomString(7);

      const owner = await this.dataSource
        .getRepository(UserEntity)
        .findOneBy({ id: userId });

      if (!owner) {
        throw new NotFoundException('User not found or username is missing');
      }

      studySet.owner = owner;

      const subject = await this.dataSource
        .getRepository(SubjectEntity)
        .findOneBy({ id: 1 });

      if (!subject) {
        throw new NotFoundException('Subject not found');
      }

      studySet.subject = subject;

      const color = await this.dataSource
        .getRepository(ColorEntity)
        .findOneBy({ id: 1 });

      if (!color) {
        throw new NotFoundException('Color not found');
      }

      studySet.color = color;

      await this.dataSource.getRepository(StudySetEntity).save(studySet);

      const flashcards = parsedTerms.map((fc) => {
        // console.log(fc.definitionMedia[1]);
        const flashcard = new FlashcardEntity();
        flashcard.term = fc.word;
        flashcard.definition = fc.definition;
        flashcard.definitionImageURL = fc.definitionMedia[1]?.imageUrl;
        flashcard.studySet = studySet;
        return flashcard;
      });

      await this.dataSource.getRepository(FlashcardEntity).save(flashcards);

      return this.mapStudySetToResponse(studySet, true);
    } catch (error) {
      console.error('Error while importing from Quizlet:', error.message);
      throw new Error('Failed to import flashcards from Quizlet');
    }
  }

  async updateFoldersInStudySet(
    updateFoldersInStudySetDto: UpdateFoldersInStudySetDto,
  ): Promise<UpdateFoldersInStudySetResponseInterface> {
    const { folderIds, studySetId } = updateFoldersInStudySetDto;
    const studySet = await this.findOne({
      where: { id: studySetId },
      relations: ['folders', 'owner'],
    });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    // Fetch all the folders corresponding to the provided IDs.
    const folders = await this.dataSource.getRepository(FolderEntity).find({
      where: { id: In(folderIds) },
      relations: ['owner'],
    });
    if (folders.length !== folderIds.length) {
      throw new NotFoundException('One or more folders not found');
    }

    if (folders.some((folder) => folder.owner.id !== studySet.owner.id)) {
      throw new ConflictException('One or more folders do not belong to user');
    }

    // Update study set's folders based on the provided IDs
    studySet.folders = folders;

    try {
      await this.save(studySet);
      return {
        success: true,
        length: folders.length,
        message: 'Folders updated in study set',
      };
    } catch (error) {
      console.error('Error updating study set:', error);
      throw new InternalServerErrorException('Error updating study set');
    }
  }

  async updateClassesInStudySet(
    updateClassesInStudySetDto: UpdateClassesInStudySetDto,
  ): Promise<UpdateClassesInStudySetResponseInterface> {
    const { classIds, studySetId } = updateClassesInStudySetDto;
    const studySet = await this.findOne({
      where: { id: studySetId },
      relations: ['classes', 'owner'],
    });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    // Fetch all the classes corresponding to the provided IDs.
    const classEntities = await this.dataSource
      .getRepository(ClassEntity)
      .find({
        where: { id: In(classIds) },
        relations: ['owner'],
      });
    if (classEntities.length !== classIds.length) {
      throw new NotFoundException('One or more classes not found');
    }

    if (
      classEntities.some(
        (classItem) => classItem.owner.id !== studySet.owner.id,
      )
    ) {
      throw new ConflictException('One or more classes do not belong to user');
    }

    // Update study set's classes based on the provided IDs
    studySet.classes = classEntities;

    try {
      await this.save(studySet);
      return {
        success: true,
        length: classEntities.length,
        message: 'Classes updated in study set',
      };
    } catch (error) {
      console.error('Error updating study set:', error);
      throw new InternalServerErrorException('Error updating study set');
    }
  }

  private mapStudySetToResponse(
    studySet: StudySetEntity,
    getFlashcards: boolean = false,
  ): GetAllStudySetResponseInterface {
    return {
      id: studySet.id,
      title: studySet.title,
      description: studySet.description,
      isPublic: studySet.isPublic,
      isAIGenerated: studySet.isAIGenerated,
      createdAt: studySet.createdAt,
      updatedAt: studySet.updatedAt,
      linkShareCode: studySet.link,
      subject: studySet.subject
        ? {
            id: studySet.subject.id,
            name: studySet.subject.name,
          }
        : undefined,
      owner: {
        id: studySet.owner ? studySet.owner.id : undefined,
        username: studySet.owner ? studySet.owner.username : undefined,
        avatarUrl: studySet.owner ? studySet.owner.avatarUrl : undefined,
        role: studySet.owner ? studySet.owner.role : undefined,
      },
      color: studySet.color
        ? {
            id: studySet.color.id,
            name: studySet.color.name,
            hexValue: studySet.color.hexValue,
          }
        : undefined,
      flashcardCount: studySet.flashcards ? studySet.flashcards.length : 0,
      previousDefinitionVoiceCode: studySet.previousDefinitionVoiceCode,
      previousTermVoiceCode: studySet.previousTermVoiceCode,
      flashcards: getFlashcards ? studySet.flashcards : [],
    };
  }

  async createStudySetFromAI(
    createStudySetFromAiDto: CreateStudySetFromAiDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const {
      userId,
      title,
      description,
      numberOfFlashcards = 10,
      language = 'en',
      questionType = 'multiple_choice',
      difficulty = 'medium',
    } = createStudySetFromAiDto;

    try {
      const GeminiAPIKey = this.configService.get<string>('GEMINI_API_KEY');
      const genAI = new GoogleGenerativeAI(GeminiAPIKey);

      const model = this.initializeGenerativeAIModel(
        genAI,
        this.createSchemaGenAll(),
      );

      const prompt = this.createPromptAll(
        title,
        description,
        numberOfFlashcards,
        language,
        difficulty,
        questionType,
      );

      const result = await model.generateContent(prompt);
      const parsedText = this.parseAIResponse(result);

      if (parsedText['study-set'].isViolent) {
        throw new BadRequestException({
          message: parsedText['study-set'].message,
        });
      } else {
        const studySet = await this.createStudySetFromParsedText(
          parsedText,
          userId,
        );
        return this.mapStudySetToResponse(studySet, true);
      }
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  private initializeGenerativeAIModel(
    genAI: GoogleGenerativeAI,
    schema: ResponseSchema,
  ) {
    return genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });
  }

  private createSchemaGenAll() {
    return {
      description: 'Create a study set with flashcards',
      type: SchemaType.OBJECT,
      properties: {
        'study-set': {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
            isViolent: { type: SchemaType.BOOLEAN },
            message: { type: SchemaType.STRING },
            flashcard: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  term: { type: SchemaType.STRING },
                  definition: { type: SchemaType.STRING },
                  hint: { type: SchemaType.STRING },
                  explanation: { type: SchemaType.STRING },
                },
                required: ['term', 'definition'],
              },
            },
          },
          required: ['title', 'flashcard'],
        },
      },
      required: ['study-set'],
    };
  }

  private createSchemaGenTitleAndDescription() {
    return {
      description: 'Create a study set with title and description',
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
      },
      required: ['name', 'description'],
    };
  }

  private createPromptAll(
    title: string,
    description: string,
    numberOfFlashcards: number,
    language: string,
    difficulty: string,
    questionType: string,
  ) {
    return `
  Bạn sẽ tạo ra một bộ flashcard bao gồm **${numberOfFlashcards} thẻ** (bắt buộc không được thiếu hay thừa), 
  với mỗi thẻ có các thuộc tính bắt buộc là \`term\` (thuật ngữ) và \`definition\` (định nghĩa). Ngoài ra, có thể bao gồm các thuộc tính tùy chọn như \`hint\` (gợi ý) và \`explanation\` (giải thích).
  
  Bộ flashcard sẽ được tạo dựa trên yêu cầu sau:
  - **Tên bộ flashcard:** ${title}
  - **Mô tả:** ${description}
  - **Ngôn ngữ:** ${language}
  - **Độ khó:** ${difficulty}
  - **Loại câu hỏi:** ${questionType}

  **Lưu ý:**
  - Ngôn ngữ phải tuân theo ngôn ngữ đã được chỉ định: **${language}**.
  - Đảm bảo rằng thông tin cung cấp là chính xác, cập nhật và phù hợp với độ khó **${difficulty}**.
  - Tất cả các flashcard phải liên quan đến **${questionType}**.
  - Không sử dụng ngôn ngữ không phù hợp hoặc không chính xác.
  
  Đầu ra của bạn phải tuân theo cấu trúc JSON dưới đây và không được vượt quá số lượng ${numberOfFlashcards} flashcard.

  \`\`\`json
  {
    "title": "${title}",
    "description": "${description}",
    "flashcards": [
      {
        "term": "Thuật ngữ 1",
        "definition": "Định nghĩa cho thuật ngữ 1.",
        "hint": "Gợi ý (tuỳ chọn).",
        "explanation": "Giải thích chi tiết hơn về thuật ngữ (tuỳ chọn)."
      },
      {
        "term": "Thuật ngữ 2",
        "definition": "Định nghĩa cho thuật ngữ 2."
      }
    ]
  }
  \`\`\`
  
  Lưu ý nếu như nội dung cung cấp không có ý nghĩa gì hoặc không hợp lệ thì bạn không cần phải tạo bộ flashcard.
  Thay vào đó hãy trả về thông báo lỗi với thuộc tính \`isViolent\` là \`true\` và \`message\` là thông báo lỗi cụ thể.
  `;
  }

  private createPromptTitleAndDescription(link: string) {
    return `
    Bạn là người đặt tên cho Study Set từ một liên kết, với tên và mô tả sẽ phụ thuộc vào nội dung và ngôn ngữ trong liên kết. 
    Ví dụ, với liên kết: https://quizlet.com/br/102542503/matematica-flash-cards/?i=640bon&x=1jqt, bạn sẽ trả về tên và mô tả theo ngôn ngữ của tiêu đề "matematica-flash-cards".

    **Lưu ý**: Vui lòng đảm bảo rằng thông tin bạn cung cấp là mới nhất và chính xác nhất có thể, dựa trên những kiến thức cập nhật gần đây.

    Nếu tiêu đề là tiếng Bồ Đào Nha, kết quả sẽ như sau:

    **Tên**: Matematica Flash Cards  
    **Mô tả**: Um conjunto de cartões de memorização para revisar conceitos fundamentais de Matemática.

    Tùy vào ngôn ngữ của tiêu đề trong liên kết, bạn sẽ trả về tên và mô tả phù hợp với ngôn ngữ đó.
    Đây là link mà bạn cần đặt tên và mô tả: ${link}
  `;
  }

  private parseAIResponse(result: any) {
    try {
      const text = JSON.parse(result.response.text());
      console.log('AI response:', text);
      return text;
    } catch (error) {
      console.error('Error parsing AI response:', error.message);
      throw new Error('Error parsing AI response');
    }
  }

  private async createStudySetFromParsedText(parsedText: any, userId: string) {
    const studySetData = parsedText['study-set'];
    const aiGeneratedTitle = studySetData.title || 'Untitled';
    const aiGeneratedDescription =
      studySetData.description || 'This study set was generated by AI.';

    const studySetEntity = new StudySetEntity();
    studySetEntity.title = aiGeneratedTitle;
    studySetEntity.description = aiGeneratedDescription;
    studySetEntity.isPublic = true;
    studySetEntity.isAIGenerated = true;
    studySetEntity.link = this.generateRandomString(7);

    const owner = await this.getUserById(userId);
    studySetEntity.owner = owner;

    const subject = await this.getSubjectById(1);
    studySetEntity.subject = subject;

    const color = await this.getColorById(1);
    studySetEntity.color = color;

    const flashcards = this.createFlashcardsFromParsedText(
      studySetData.flashcard,
      studySetEntity,
    );

    await this.saveEntitiesToDatabase(studySetEntity, flashcards);

    return studySetEntity;
  }

  private async getUserById(userId: string) {
    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async getSubjectById(subjectId: number) {
    const subject = await this.dataSource
      .getRepository(SubjectEntity)
      .findOneBy({ id: subjectId });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }
    return subject;
  }

  private async getColorById(colorId: number) {
    const color = await this.dataSource
      .getRepository(ColorEntity)
      .findOneBy({ id: colorId });
    if (!color) {
      throw new NotFoundException('Color not found');
    }
    return color;
  }

  private createFlashcardsFromParsedText(
    flashcardsAI: any[],
    studySet: StudySetEntity,
  ) {
    if (flashcardsAI && Array.isArray(flashcardsAI)) {
      return flashcardsAI.map((fc) => {
        const flashcard = new FlashcardEntity();
        flashcard.term = fc.term;
        flashcard.definition = fc.definition;
        flashcard.isAIGenerated = true;
        flashcard.hint = fc.hint;
        flashcard.explanation = fc.explanation;
        flashcard.studySet = studySet;
        return flashcard;
      });
    }
    return [];
  }

  private async saveEntitiesToDatabase(
    studySet: StudySetEntity,
    flashcards: FlashcardEntity[],
  ) {
    await this.dataSource.getRepository(StudySetEntity).save(studySet);
    if (flashcards.length > 0) {
      await this.dataSource.getRepository(FlashcardEntity).save(flashcards);
    }
  }

  async getStudySetByCode(
    getClassByCodeParamDto: GetStudySetByCodeParamDto,
  ): Promise<GetAllStudySetResponseInterface> {
    const { code } = getClassByCodeParamDto;

    try {
      const studySet = await this.dataSource
        .getRepository(StudySetEntity)
        .findOne({
          where: { link: code },
          relations: ['owner', 'subject', 'color', 'flashcards'],
        });

      if (!studySet) {
        throw new NotFoundException('Study set not found');
      }

      if (studySet.owner.userStatus === UserStatusEnum.BLOCKED) {
        throw new NotFoundException('Study set owner is blocked');
      }

      return this.mapStudySetToResponse(studySet, true);
    } catch (error) {
      console.log('Error getting study set', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting study set');
    }
  }

  private generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  async getStudySetsBySubjectId(
    getStudySetsBySubjectIdParamDto: GetStudySetsBySubjectIdParamDto,
    getStudySetsBySubjectIdQueryDto: GetStudySetsBySubjectIdQueryDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    const { subjectId } = getStudySetsBySubjectIdParamDto;
    const { size = 40, page = 1 } = getStudySetsBySubjectIdQueryDto;

    if (page < 1) {
      throw new NotFoundException('Invalid page number');
    }

    if (size < 1 || size > 40) {
      throw new NotFoundException('Invalid size');
    }

    try {
      const studySets = await this.dataSource
        .getRepository(StudySetEntity)
        .find({
          where: { subject: { id: subjectId } },
          relations: ['owner', 'subject', 'color', 'flashcards'],
          skip: (page - 1) * size,
          take: size,
        });

      return studySets.map((studySet) => this.mapStudySetToResponse(studySet));
    } catch (error) {
      console.log('Error getting study sets', error);
      throw new InternalServerErrorException('Error getting study sets');
    }
  }

  async getTop5SubjectByStudySetCount(): Promise<
    TopSubjectResponseInterface[]
  > {
    try {
      const subjects = await this.dataSource
        .getRepository(SubjectEntity)
        .createQueryBuilder('subject')
        .leftJoin('subject.studySets', 'studySet')
        .groupBy('subject.id')
        .orderBy('COUNT(studySet.id)', 'DESC')
        .limit(5)
        .select([
          'subject.id',
          'subject.name',
          'COUNT(studySet.id) AS studySetCount',
        ])
        .getRawMany();

      console.log('subjects', subjects);

      return subjects.map((subject) => ({
        id: subject.subject_id,
        name: subject.subject_name,
        studySetCount: parseInt(subject.studysetcount, 10),
        createdAt: subject.subject_createdAt,
        updatedAt: subject.subject_updatedAt,
      }));
    } catch (error) {
      console.log('Error getting top 5 subjects by study set count', error);
      throw new InternalServerErrorException(
        'Error getting top 5 subjects by study set count',
      );
    }
  }

  async updateRecentStudySet(updateRecentStudySetDto: UpdateRecentStudySetDto) {
    const { userId, studySetId } = updateRecentStudySetDto;

    const recentStudySet = await this.dataSource
      .getRepository(RecentStudySetEntity)
      .findOne({
        where: { user: { id: userId }, studySet: { id: studySetId } },
      });

    if (recentStudySet) {
      recentStudySet.accessedAt = new Date();
      await this.dataSource
        .getRepository(RecentStudySetEntity)
        .save(recentStudySet);
      return;
    }

    const user = await this.dataSource
      .getRepository(UserEntity)
      .findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const studySet = await this.findOne({
      where: { id: studySetId },
    });
    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    const recentStudySetEntity = new RecentStudySetEntity();
    recentStudySetEntity.user = user;
    recentStudySetEntity.studySet = studySet;

    await this.dataSource
      .getRepository(RecentStudySetEntity)
      .save(recentStudySetEntity);
  }

  async getStudySetRecentByUserId(
    getStudySetsByUserIdDto: GetStudySetsByUserIdDto,
  ): Promise<GetAllStudySetResponseInterface[]> {
    const { userId } = getStudySetsByUserIdDto;
    try {
      const studySets = await this.dataSource
        .getRepository(RecentStudySetEntity)
        .find({
          where: { user: { id: userId } },
          relations: [
            'studySet',
            'studySet.owner',
            'studySet.subject',
            'studySet.color',
            'studySet.flashcards',
          ],
          order: { accessedAt: 'DESC' },
          take: 15,
        });

      return studySets.map((recentStudySet) => {
        return this.mapStudySetToResponse(recentStudySet.studySet, false);
      });
    } catch (error) {
      console.log('Error getting study sets', error);
      throw new InternalServerErrorException('Error getting study sets');
    }
  }

  async analyzeStudySet(
    analyzeStudySetDto: AnalyzeStudySetDto,
  ): Promise<{ bestMode: LearnModeEnum[] }> {
    const { studySetId } = analyzeStudySetDto;
    const studySet = await this.findOne({
      where: { id: studySetId },
      relations: ['flashcards'],
    });

    if (!studySet) {
      throw new NotFoundException('Study set not found');
    }

    // Call the AI service to analyze the study set
    const aiResponse = await this.callAIService(studySet);

    // Save the analysis result to the database
    studySet.bestLearnModes = aiResponse.bestMode;
    await this.save(studySet);

    return { bestMode: aiResponse.bestMode };
  }

  private async callAIService(
    studySet: StudySetEntity,
  ): Promise<{ bestMode: LearnModeEnum[] }> {
    const flashcards = studySet.flashcards.map((flashcard) => {
      return {
        term: flashcard.term,
        definition: flashcard.definition,
        hint: flashcard.hint,
        explanation: flashcard.explanation,
      };
    });

    const aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL');
    const response = await axios.post(aiServiceUrl, {
      flashcards,
    });

    return response.data;
  }

  async removeInvalidStudySets() {
    const studySets = await this.find({
      relations: ['flashcards'],
    });

    const studySetMap = {};
    const studySetIdsToDelete = [];
    for (const studySet of studySets) {
      if (studySet.flashcards.length === 0) {
        studySetIdsToDelete.push(studySet.id);
      } else {
        if (studySetMap[studySet.title]) {
          studySetIdsToDelete.push(studySetMap[studySet.title]);
        }
        studySetMap[studySet.title] = studySet.id;
      }
    }

    await this.dataSource
      .getRepository(StudySetEntity)
      .delete(studySetIdsToDelete);
  }

  async createHintFromAIForFlashcard(
    createWriteHintBodyDto: CreateWriteHintBodyDto,
  ): Promise<CreateWriteHintResponseInterface> {
    const flashcard = await this.dataSource
      .getRepository(FlashcardEntity)
      .findOne({
        where: { id: createWriteHintBodyDto.flashcardId },
      });

    if (!flashcard) {
      throw new NotFoundException('Flashcard not found');
    }

    // initialize the AI model
    const GeminiAPIKey = this.configService.get<string>('GEMINI_API_KEY');
    const genAI = new GoogleGenerativeAI(GeminiAPIKey);
    const model = this.initializeGenerativeAIModel(
      genAI,
      this.createSchemaGenHint(),
    );

    // create prompt
    const prompt = `
  Bạn là một AI thông minh, nhiệm vụ của bạn là tạo một gợi ý (hint) chi tiết và hữu ích cho flashcard dựa trên các thông tin sau:
  - **Câu hỏi (question)**: ${createWriteHintBodyDto.question}
  - **Câu trả lời (answer)**: ${createWriteHintBodyDto.answer}
  - **Tiêu đề bộ học (study set title)**: ${createWriteHintBodyDto.studySetTitle}
  - **Mô tả bộ học (study set description)**: ${createWriteHintBodyDto.description || 'Không có'}

  Yêu cầu:  
  - Gợi ý phải dài ít nhất 2 câu, tập trung vào giải thích ngữ nghĩa của câu hỏi hoặc câu trả lời.  
  - Cung cấp ngữ cảnh hoặc tình huống cụ thể để người học dễ liên tưởng đến câu trả lời.  
  - Tránh lặp lại nguyên văn câu hỏi hoặc câu trả lời, mà thay vào đó hãy diễn giải ý nghĩa hoặc mô tả tình huống liên quan.  
  - Không nói trực tiếp lại đáp án và câu hỏi
  - Nếu nội dung khó hiểu, hãy giải thích khái niệm bằng cách so sánh hoặc đưa ví dụ cụ thể.  

  **Lưu ý quan trọng:**  
  - Nếu bạn không thể tạo ra gợi ý vì thiếu thông tin hoặc ngữ cảnh không rõ ràng, hãy phản hồi một trong các thông điệp sau:
    - Nếu câu hỏi hoặc câu trả lời bị thiếu hoặc không rõ ràng:  
      "Không thể tạo gợi ý do thiếu thông tin câu hỏi hoặc câu trả lời. Vui lòng cung cấp câu hỏi và câu trả lời rõ ràng hơn."
    - Nếu thông tin bộ học không đủ rõ ràng:  
      "Không thể tạo gợi ý vì mô tả bộ học không đủ chi tiết. Vui lòng cung cấp mô tả bộ học rõ ràng hơn."
    - Nếu không thể tạo ra gợi ý hợp lý:  
      "Không thể tạo gợi ý do thiếu ngữ cảnh hoặc thông tin liên quan. Vui lòng cung cấp thông tin bổ sung để tạo gợi ý chính xác hơn."
      
  Lưu ý nếu như nội dung cung cấp không có ý nghĩa gì hoặc không hợp lệ thì bạn không cần phải tạo hint.
  Thay vào đó hãy trả về thông báo lỗi với thuộc tính \`isViolent\` là \`true\` và \`message\` là thông báo lỗi cụ thể.

  Hãy viết một gợi ý đầy đủ, sáng tạo và dễ hiểu bằng ngôn ngữ phù hợp với thông tin đầu vào!
`;

    const result = await model.generateContent(prompt);
    const parsedText = this.parseAIResponse(result);

    const aiHint = parsedText.hint;

    // Update flashcard with the new hint
    if (!parsedText.isViolent) {
      flashcard.hint = aiHint;
      await this.dataSource.getRepository(FlashcardEntity).save(flashcard);
    }

    return {
      flashcardId: flashcard.id,
      aiHint,
      isViolated: parsedText.isViolent,
      message: parsedText.message,
    };
  }

  private createSchemaGenHint() {
    return {
      description: 'Create a hint for a flashcard',
      type: SchemaType.OBJECT,
      properties: {
        hint: { type: SchemaType.STRING },
        isViolent: { type: SchemaType.BOOLEAN },
        message: { type: SchemaType.STRING },
      },
      required: ['hint', 'isViolent', 'message'],
    };
  }

  async deleteAllStudySetsOfUser(
    deleteAllStudySetByUserIdParamDto: DeleteAllStudySetByUserIdParamDto,
  ): Promise<void> {
    const { userId } = deleteAllStudySetByUserIdParamDto;
    await this.dataSource
      .getRepository(StudySetEntity)
      .delete({ owner: { id: userId } });
  }
}
